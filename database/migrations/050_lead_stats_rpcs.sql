-- Lead stats aggregations in SQL (dashboard /dashboard/stats).
-- Confirmation rate = (confirmed|swapper) / (status <> initial).

CREATE OR REPLACE FUNCTION public.get_lead_stats_summary(
  p_date1 date DEFAULT NULL,
  p_date2 date DEFAULT NULL,
  p_objective text DEFAULT NULL,
  p_agent_id bigint DEFAULT NULL,
  p_channel text DEFAULT NULL,
  p_product text DEFAULT NULL
)
RETURNS TABLE (
  total_leads bigint,
  actionable_leads bigint,
  confirmed_or_swapper_leads bigint,
  confirmation_rate numeric
)
LANGUAGE sql
STABLE
AS $$
  WITH filtered AS (
    SELECT l.status
    FROM public.leads l
    WHERE (p_date1 IS NULL OR (l.created_at AT TIME ZONE 'UTC')::date >= p_date1)
      AND (p_date2 IS NULL OR (l.created_at AT TIME ZONE 'UTC')::date <= p_date2)
      AND (p_objective IS NULL OR l.objective = p_objective)
      AND (p_agent_id IS NULL OR l.agent_id = p_agent_id)
      AND (p_channel IS NULL OR l.channel = p_channel)
      AND (
        p_product IS NULL
        OR l.product ILIKE ('%' || p_product || '%')
      )
  )
  SELECT
    COUNT(*)::bigint AS total_leads,
    COUNT(*) FILTER (
      WHERE lower(coalesce(status, '')) <> 'initial'
    )::bigint AS actionable_leads,
    COUNT(*) FILTER (
      WHERE lower(coalesce(status, '')) IN ('confirmed', 'swapper')
    )::bigint AS confirmed_or_swapper_leads,
    CASE
      WHEN COUNT(*) FILTER (
        WHERE lower(coalesce(status, '')) <> 'initial'
      ) = 0 THEN 0::numeric
      ELSE ROUND(
        (
          COUNT(*) FILTER (
            WHERE lower(coalesce(status, '')) IN ('confirmed', 'swapper')
          )::numeric
          / COUNT(*) FILTER (
            WHERE lower(coalesce(status, '')) <> 'initial'
          )::numeric
        ) * 100,
        1
      )
    END AS confirmation_rate
  FROM filtered;
$$;

CREATE OR REPLACE FUNCTION public.get_lead_stats_bars(
  p_group_by text DEFAULT 'channel',
  p_date1 date DEFAULT NULL,
  p_date2 date DEFAULT NULL,
  p_objective text DEFAULT NULL,
  p_agent_id bigint DEFAULT NULL,
  p_channel text DEFAULT NULL,
  p_product text DEFAULT NULL
)
RETURNS TABLE (
  key text,
  label text,
  value bigint
)
LANGUAGE sql
STABLE
AS $$
  WITH filtered AS (
    SELECT
      l.objective,
      l.channel,
      l.product,
      l.agent_id,
      u.name AS agent_name,
      u.email AS agent_email
    FROM public.leads l
    LEFT JOIN public.users u ON u.id = l.agent_id
    WHERE (p_date1 IS NULL OR (l.created_at AT TIME ZONE 'UTC')::date >= p_date1)
      AND (p_date2 IS NULL OR (l.created_at AT TIME ZONE 'UTC')::date <= p_date2)
      AND (p_objective IS NULL OR l.objective = p_objective)
      AND (p_agent_id IS NULL OR l.agent_id = p_agent_id)
      AND (p_channel IS NULL OR l.channel = p_channel)
      AND (
        p_product IS NULL
        OR l.product ILIKE ('%' || p_product || '%')
      )
  ),
  grouped AS (
    SELECT
      CASE lower(coalesce(p_group_by, 'channel'))
        WHEN 'objective' THEN coalesce(nullif(trim(objective), ''), 'Unknown')
        WHEN 'product' THEN coalesce(nullif(trim(product), ''), 'Unknown')
        WHEN 'agent' THEN coalesce(agent_id::text, 'Unknown')
        ELSE coalesce(nullif(trim(channel), ''), 'Unknown')
      END AS key,
      CASE lower(coalesce(p_group_by, 'channel'))
        WHEN 'objective' THEN coalesce(nullif(trim(objective), ''), 'Unknown')
        WHEN 'product' THEN coalesce(nullif(trim(product), ''), 'Unknown')
        WHEN 'agent' THEN coalesce(
          nullif(trim(agent_name), ''),
          nullif(trim(agent_email), ''),
          CASE WHEN agent_id IS NULL THEN 'Unknown' ELSE 'Agent #' || agent_id::text END
        )
        ELSE coalesce(nullif(trim(channel), ''), 'Unknown')
      END AS label,
      COUNT(*)::bigint AS value
    FROM filtered
    GROUP BY 1, 2
  )
  SELECT g.key, g.label, g.value
  FROM grouped g
  ORDER BY g.value DESC, g.label ASC;
$$;

COMMENT ON FUNCTION public.get_lead_stats_summary IS
  'Dashboard lead totals + confirmation rate for optional filters.';

COMMENT ON FUNCTION public.get_lead_stats_bars IS
  'Dashboard lead counts grouped by objective|agent|channel|product with optional filters.';

GRANT EXECUTE ON FUNCTION public.get_lead_stats_summary(date, date, text, bigint, text, text)
  TO authenticated, anon, service_role;

GRANT EXECUTE ON FUNCTION public.get_lead_stats_bars(text, date, date, text, bigint, text, text)
  TO authenticated, anon, service_role;

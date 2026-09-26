import * as React from "react";

import { cn } from "@/shared/utils/utils";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children, className, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table
      className={cn(
        "min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </table>
  </div>
);
Table.displayName = "Table";

const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => (
  <thead className={cn("bg-gray-50 dark:bg-gray-700", className)} {...props}>
    {children}
  </thead>
);
TableHeader.displayName = "TableHeader";

const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  className,
  ...props
}) => (
  <tbody
    className={cn("divide-y divide-gray-200 dark:divide-gray-700", className)}
    {...props}
  >
    {children}
  </tbody>
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  className,
  ...props
}) => (
  <tr
    className={cn("hover:bg-gray-100 dark:hover:bg-gray-600", className)}
    {...props}
  >
    {children}
  </tr>
);
TableRow.displayName = "TableRow";

const TableHead: React.FC<React.HTMLAttributes<HTMLTableCellElement>> = ({
  children,
  className,
  ...props
}) => (
  <th
    className={cn(
      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300",
      className
    )}
    {...props}
  >
    {children}
  </th>
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.HTMLAttributes<HTMLTableCellElement> & {
    colSpan?: number;
  }
>(({ children, className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100",
      className
    )}
    {...props}
  >
    {children}
  </td>
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

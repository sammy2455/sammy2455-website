import type { ComponentPropsWithoutRef } from "react"

type TableProps = ComponentPropsWithoutRef<"table">
type TheadProps = ComponentPropsWithoutRef<"thead">
type TbodyProps = ComponentPropsWithoutRef<"tbody">
type TrProps = ComponentPropsWithoutRef<"tr">
type ThProps = ComponentPropsWithoutRef<"th">
type TdProps = ComponentPropsWithoutRef<"td">

const MdxTable = ({ children, ...props }: TableProps) => (
  <div className="mdx-table-wrapper">
    <table {...props}>{children}</table>
  </div>
)

const MdxThead = ({ children, ...props }: TheadProps) => (
  <thead {...props}>{children}</thead>
)

const MdxTbody = ({ children, ...props }: TbodyProps) => (
  <tbody {...props}>{children}</tbody>
)

const MdxTr = ({ children, ...props }: TrProps) => (
  <tr {...props}>{children}</tr>
)

const MdxTh = ({ children, ...props }: ThProps) => (
  <th {...props}>{children}</th>
)

const MdxTd = ({ children, ...props }: TdProps) => (
  <td {...props}>{children}</td>
)

export const mdxComponents = {
  table: MdxTable,
  thead: MdxThead,
  tbody: MdxTbody,
  tr: MdxTr,
  th: MdxTh,
  td: MdxTd,
}

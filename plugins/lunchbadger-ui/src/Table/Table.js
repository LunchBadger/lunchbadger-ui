import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
  TableFooter,
} from 'material-ui/Table';
import './Table.scss';

export default class TableComponent extends PureComponent {
  static propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    widths: PropTypes.array,
    paddings: PropTypes.array,
    centers: PropTypes.array,
  };

  static defaultProps = {
    widths: [],
    paddings: [],
    centers: [],
  };

  getColumnStyles = (idx, isHeader = false) => {
    const {widths, paddings, centers} = this.props;
    return {
      width: widths[idx],
      padding: !paddings[idx] ? 0 : (isHeader ? '0 8px' : undefined),
      verticalAlign: (!paddings[idx] || isHeader) ? 'middle' : 'bottom',
      textAlign: centers[idx] ? 'center' : 'left',
    };
  };

  render() {
    const {columns, data} = this.props;
    return (
      <Table
        className="Table"
        selectable={false}
      >
        <TableHeader
          adjustForCheckbox={false}
          displaySelectAll={false}
        >
          <TableRow>
            {columns.map((item, idx) => (
              <TableHeaderColumn
                key={idx}
                className="TableHeaderColumn"
                style={this.getColumnStyles(idx, true)}
              >
                {item}
              </TableHeaderColumn>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          {data.map((row, idxRow) => (
            <TableRow key={idxRow} displayBorder>
              {row.map((column, idxColumn) => (
                <TableRowColumn
                  key={idxColumn}
                  className="TableRowColumn"
                  style={this.getColumnStyles(idxColumn)}
                >
                  {column}
                </TableRowColumn>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter adjustForCheckbox={false} className="TableFooter">
          <TableRow>
            <TableRowColumn colSpan={columns.length} />
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
}

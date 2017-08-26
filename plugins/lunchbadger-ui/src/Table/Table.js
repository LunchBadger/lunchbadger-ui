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
  };

  static defaultProps = {
    widths: [],
  };

  getColumnStyles = idx => ({
    width: this.props.widths[idx],
    paddingRight: idx === this.props.columns.length - 1 ? 0 : undefined,
  });

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
                style={this.getColumnStyles(idx)}
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

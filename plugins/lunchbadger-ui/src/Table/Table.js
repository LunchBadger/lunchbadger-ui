import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import './Table.scss';

export default class TableComponent extends PureComponent {
  static propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    widths: PropTypes.array,
    paddings: PropTypes.array,
    centers: PropTypes.array,
    tableLayout: PropTypes.string,
    verticalAlign: PropTypes.string,
  };

  static defaultProps = {
    widths: [],
    paddings: [],
    centers: [],
    tableLayout: 'auto',
    verticalAlign: 'bottom',
  };

  getColumnStyles = (idx, isHeader = false) => {
    const {widths, paddings, centers, verticalAlign} = this.props;
    return {
      width: widths[idx],
      padding: !paddings[idx] ? 0 : (isHeader ? '0 8px' : undefined),
      verticalAlign: (!paddings[idx] || isHeader) ? 'middle' : verticalAlign,
      textAlign: centers[idx] ? 'center' : 'left',
    };
  };

  render() {
    const {columns, data, widths, tableLayout} = this.props;
    const minWidth = widths.reduce((size, item) => size += item || 100, 0);
    const style = {tableLayout};
    return (
      <div style={{overflowX: 'auto'}}>
        <div style={{minWidth}}>
          <Table
            className="Table"
            selectable={false}
            style={style}
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
                <TableRow key={idxRow} className="TableRow" displayBorder>
                  {row.map((column, idxColumn) => (
                    <TableRowColumn
                      key={idxColumn}
                      className={cs('TableRowColumn', typeof column)}
                      style={this.getColumnStyles(idxColumn)}
                    >
                      {column}
                    </TableRowColumn>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

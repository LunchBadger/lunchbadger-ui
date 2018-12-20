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
import {Sortable} from '../';
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
    sortable: PropTypes.bool,
    sortableHandlerOffsetTop: PropTypes.string,
    renderRowAfter: PropTypes.array,
    noHeader: PropTypes.bool,
  };

  static defaultProps = {
    data: [],
    widths: [],
    paddings: [],
    centers: [],
    tableLayout: 'auto',
    verticalAlign: 'bottom',
    sortable: false,
    renderRowAfter: [],
    noHeader: false,
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

  getTableStyle = () => {
    const {tableLayout} = this.props;
    return {tableLayout};
  };

  renderRow = (row, idxRow) => (
    <Table
      key={idxRow}
      className="Table"
      selectable={false}
      style={this.getTableStyle()}
    >
      <TableBody
        displayRowCheckbox={false}
      >
        <TableRow className="TableRow" displayBorder>
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
        {this.props.renderRowAfter[idxRow] && (
          <TableRow className="TableRow" displayBorder>
            <TableRowColumn
              colSpan={row.length}
              style={{padding: 0}}
            >
              {this.props.renderRowAfter[idxRow]}
            </TableRowColumn>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  render() {
    const {
      columns,
      data,
      widths,
      sortable,
      sortableHandlerOffsetTop,
      onReorder,
      noHeader,
    } = this.props;
    const minWidth = widths.reduce((size, item) => size += item || 100, 0);
    return (
      <div style={{overflowX: 'auto'}}>
        <div style={{minWidth}}>
          {!noHeader && (
            <Table
              className={cs('Table', {sortable})}
              selectable={false}
              style={this.getTableStyle()}
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
            </Table>
          )}
          {sortable && (
            <Sortable
              items={data}
              renderItem={this.renderRow}
              onSortEnd={onReorder}
              offset={[0, 20]}
              inPanel
              handlerOffsetTop={sortableHandlerOffsetTop}
            />
          )}
          {!sortable && data.map(this.renderRow)}
        </div>
      </div>
    );
  }
}

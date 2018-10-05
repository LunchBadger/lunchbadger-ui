import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {IconSVG} from '../';
import {iconReorder} from '../../../../src/icons';
import './Sortable.scss';

const DragHandle = SortableHandle(({
  handlerOffsetTop: top = 0,
  handlerOffsetLeft: left = 0,
}) => (
  <IconSVG
    className="Sortable__handler"
    svg={iconReorder}
    styles={{
      top: 15 + top,
      left,
    }}
  />
));

const SortableItem = SortableElement(({children, inPanel = false, offset = [-20, 20], ...props}) => {
  const classNames = inPanel ? 'editable panel panel__details' : '';
  const style = {
    marginLeft: offset[0],
    paddingLeft: offset[1],
  };
  return (
    <div className={`Sortable__draggable ${classNames}`} style={style}>
      <DragHandle {...props} />
      {children}
    </div>
  );
});

class SortableList extends PureComponent {
  render() {
    const {items, renderItem, inPanel, offset, ...props} = this.props;
    return (
      <div className={cs('Sortable', {onCanvas: !inPanel})}>
        {items.map((item, idx) => (
          <SortableItem
            key={item.id || idx}
            index={idx}
            inPanel={inPanel}
            offset={offset}
            {...props}
          >
            {renderItem(item, idx)}
          </SortableItem>
        ))}
      </div>
    );
  }
}

const SortableListComponent = SortableContainer(SortableList, {withRef: true});

class Sortable extends PureComponent {
  static propTypes = {
    items: PropTypes.array,
    renderItem: PropTypes.func,
    onSortEnd: PropTypes.func,
    handlerOffsetTop: PropTypes.number,
    handlerOffsetLeft: PropTypes.number,
    inPanel: PropTypes.bool,
    offset: PropTypes.array,
  };

  getContainer = () => document
    .getElementsByClassName(this.props.inPanel
      ? 'BaseDetails__content'
      : 'canvas__wrapper')[0];

  render() {
    const {
      onSortEnd,
      items,
      renderItem,
      handlerOffsetTop,
      handlerOffsetLeft,
      inPanel,
      offset,
    } = this.props;
    return (
      <SortableListComponent
        items={items}
        renderItem={renderItem}
        onSortEnd={onSortEnd}
        useDragHandle
        lockAxis="y"
        lockToContainerEdges
        getContainer={this.getContainer}
        handlerOffsetTop={handlerOffsetTop}
        handlerOffsetLeft={handlerOffsetLeft}
        inPanel={inPanel}
        offset={offset}
      />
    );
  }
}

export default Sortable;

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
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

const SortableItem = SortableElement(({children, inPanel = false, ...props}) => {
  const classNames = inPanel ? 'editable panel panel__details' : '';
  return (
    <div className={`Sortable__draggable ${classNames}`}>
      <DragHandle {...props} />
      {children}
    </div>
  );
});

class SortableList extends PureComponent {
  render() {
    const {items, renderItem, ...props} = this.props;
    return (
      <div className="Sortable">
        {items.map((item, idx) => (
          <SortableItem key={item.id} index={idx} {...props}>
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
  };

  render() {
    const {
      onSortEnd,
      items,
      renderItem,
      handlerOffsetTop,
      handlerOffsetLeft,
      inPanel,
    } = this.props;
    return (
      <SortableListComponent
        items={items}
        renderItem={renderItem}
        onSortEnd={onSortEnd}
        useDragHandle
        lockAxis="y"
        lockToContainerEdges
        getContainer={() => document.getElementsByClassName('BaseDetails__content')[0]}
        handlerOffsetTop={handlerOffsetTop}
        handlerOffsetLeft={handlerOffsetLeft}
        inPanel={inPanel}
      />
    );
  }
}

export default Sortable;

import React from 'react';
import PropTypes from 'prop-types';
import {DropTarget} from 'react-dnd';
import List, {ListSubheader} from 'material-ui/List';

const dropEvents = {
    drop(props) {
        return {id:props.id};
    }
};

const TargetBuilder = types => {
    const Target = ({connectDropTarget, canDrop, label, isDraggingText = 'Drag here...', classes = '', isDraggingClasses = 'drop-target', children}) => {
        return connectDropTarget(
            <div className={canDrop ? isDraggingClasses : classes}>
                <List>
                    <ListSubheader>{canDrop ? isDraggingText : label}</ListSubheader>
                    {children}
                </List>
            </div>
        )
    };

    Target.propTypes = {
        connectDropTarget: PropTypes.func.isRequired,
        isOver: PropTypes.bool.isRequired,
        canDrop: PropTypes.bool.isRequired,
        onDrop: PropTypes.func.isRequired,
        label: PropTypes.string,
        isDraggingText: PropTypes.string,
        isDraggingClasses: PropTypes.string
    };

    return  DropTarget(types, dropEvents, (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    }))(Target);
};

export default TargetBuilder;
import React from 'react';
import PropTypes from 'prop-types';
import {ListItem, ListItemText, ListItemSecondaryAction} from 'material-ui/List';
import {DragSource} from 'react-dnd';
import ExpansionPanel, {
    ExpansionPanelSummary,
    ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMore from 'material-ui-icons/ExpandMore';
import Button from 'material-ui/Button';
import CloseIcon from 'material-ui-icons/Close';

const dragEvents = {
    beginDrag({id, primary, secondary}) {
        return {primary, secondary, id}
    },
    endDrag(props, monitor, component) {
        if (!monitor.didDrop()) return;

        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        props.onDrop(dropResult.id, item.id)
    }
};

const DraggableItemBuilder = type => {
    const DraggableItem = ({isDragging, connectDragSource, id, primary, secondary, secondPrimary, secondSecondary, classes,
                               isNotAList, hasDetails, children, onClick, style, onRemove, canModify}) => {
        if(isNotAList) {
            return connectDragSource(
                <div className={classes} onClick={onClick} style={style}>
                    {canModify && <div style={{float:'right'}}>
                        <Button onClick={onRemove}>
                            <CloseIcon/>
                        </Button>
                    </div>}
                    {children}
                </div>
            )
        } else {
            return hasDetails ? connectDragSource(
                <div className={classes} onClick={onClick} style={style}>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                            <ListItem value={id} style={{opacity: isDragging ? 0.5 : 1}}>
                                <ListItemText primary={primary} secondary={secondary}/>
                                {canModify && <ListItemSecondaryAction>
                                    <Button onClick={onRemove}>
                                        <CloseIcon/>
                                    </Button>
                                </ListItemSecondaryAction>}
                            </ListItem>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails style={{background:'#f7f7f7'}}>
                            <div style={{display:'flex', flex:1, flexDirection:'row', justifyContent:'space-around'}}>
                                {children}
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                </div>
            ) : connectDragSource(
                <div className={classes} onClick={onClick} style={style}>
                    <ListItem value={id} style={{opacity: isDragging ? 0.5 : 1}} >
                        <ListItemText primary={primary} secondary={secondary}  />
                        <ListItemText primary={secondPrimary} secondary={secondSecondary}  />
                        <ListItemSecondaryAction>
                            {children}
                            {canModify && <Button onClick={onRemove}>
                                <CloseIcon/>
                            </Button>}
                        </ListItemSecondaryAction>
                    </ListItem>
                </div>
            );
        }
    };

    DraggableItem.propTypes = {
        id: PropTypes.string,
        onDrop: PropTypes.func.isRequired,
        primary: PropTypes.string,
        secondary: PropTypes.string,

        // Injected by React DnD:
        connectDragSource: PropTypes.func.isRequired,
        isDragging: PropTypes.bool,
        hasDetails: PropTypes.bool
    };

    return DragSource(type, dragEvents, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
    }))(DraggableItem);
};

export default DraggableItemBuilder;
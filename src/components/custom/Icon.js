import React from 'react';
import PropTypes from 'prop-types';
import * as fa from 'react-icons/fa';
import * as md from 'react-icons/md';
import * as go from 'react-icons/go';
import * as io from 'react-icons/io';
import * as ti from 'react-icons/ti';
const AllIcons = {fa, md, go, io, ti, ioios:io};
const setKeys = {
    ioios: 'IoIos',
    io: 'Io',
    md: 'Md',
    fa: 'Fa',
    go: 'Go',
    ti: 'Ti'
};

const getSetPrefix = set => set in setKeys ? setKeys[set] : 'IoIos';
const camelCase = word => word.split('-')
    .map(w => `${w.slice(0,1).toUpperCase()}${w.slice(1)}`)
    .join('');

const Icon = ({name, iconSet:set='ioios', ...rest}) => {
    const prefix = getSetPrefix(set);
    const src = `${prefix}${camelCase(name)}`;

    const iconSet = AllIcons[set];
    const MyIcon = iconSet[src];
    return <MyIcon {...rest} />
};

Icon.propTypes = {
    name: PropTypes.string,
    iconSet: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
};

export default Icon;

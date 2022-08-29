/* eslint-disable react/display-name */
import { memo } from 'react';
import PropTypes from 'prop-types';
import { useRecoilValue } from 'recoil';

function StartUpItem({ item }) {
	useRecoilValue(item);

	return null;
}

StartUpItem.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	item: PropTypes.object.isRequired,
};

export default memo(StartUpItem);

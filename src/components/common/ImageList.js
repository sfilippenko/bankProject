import React from 'react';
import constants from '../../constants/constants';
import ReactTooltipWrapper from './ReactTooltipWrapper';
import borrower from '../../images/borrower.png';
import pledger from '../../images/pledger.png';
import trustor from '../../images/trustor.png';
import guarantor from '../../images/guarantor.png';

const includesList = [constants.borrowerId, constants.pledgerId, constants.trustorId, constants.guarantorId];

export default class ImageList extends React.Component {
    render() {
        const {list, style = {maxWidth: 150}, imgHeight = 50, isTooltip, id, children} = this.props;
        const imageList = list.filter((key) => includesList.includes(key)).map((key, index) => {
            let src;
            switch (key) {
                case constants.borrowerId: {
                    src = borrower;
                    break;
                }
                case constants.pledgerId: {
                    src = pledger;
                    break;
                }
                case constants.trustorId: {
                    src = trustor;
                    break;
                }
                case constants.guarantorId: {
                    src = guarantor;
                    break;
                }
            }
            return <img key={index} src={src} height={imgHeight}/>;
        });
        const content = <div style={{textAlign: 'center', ...style}}>{imageList}</div>;

        if (isTooltip) {
            return(
                <div data-tip data-for={String(id)}>
                    {children}
                    {
                        imageList.size > 0 &&
                        <ReactTooltipWrapper
                            id={String(id)}
                            tooltip={content}
                        />
                    }
                </div>
            )
        }
        return content;
    }
}
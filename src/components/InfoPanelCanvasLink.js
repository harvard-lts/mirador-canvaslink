import React, { Component } from 'react';

class InfoPanelCanvasLink extends Component {
  render() {
    const { config, manifestId, visibleCanvases } = this.props;
    const { getCanvasLink, infoPanelEnabled } = config || {};
    
    if (!infoPanelEnabled) return <></>;

    // Generate the canvas link if we have the necessary data
    const canvasLink = getCanvasLink && manifestId && visibleCanvases && visibleCanvases.length > 0 
      ? getCanvasLink(manifestId, visibleCanvases) 
      : null;
    
    // Create object link without page parameter for "Link to this object"
    const objectLink = canvasLink ? canvasLink.split('?')[0] : null;

    return (
      <>
        <this.props.TargetComponent {...this.props.targetProps} />
        <dt className="MuiTypography-root MuiTypography-subtitle2">
          Link to this object
        </dt>
        {objectLink && (
          <dd className="MuiTypography-root MuiTypography-body1">
            <a
              className="MuiTypography-root MuiLink-root MuiLink-underlineAlways MuiTypography-colorPrimary"
              target="_blank"
              rel="noopener noreferrer"
              href={objectLink}
            >
              {objectLink}
            </a>
          </dd>
        )}
        <dt className="MuiTypography-root MuiTypography-subtitle2">
          Canvas permalink
        </dt>
        {canvasLink && (
          <dd className="MuiTypography-root MuiTypography-body1">
            <a
              className="MuiTypography-root MuiLink-root MuiLink-underlineAlways MuiTypography-colorPrimary"
              target="_blank"
              rel="noopener noreferrer"
              href={canvasLink}
            >
              {canvasLink}
            </a>
          </dd>
        )}
      </>
    );
  }
}

export default {
  target: 'ManifestRelatedLinks',
  mode: 'wrap',
  component: InfoPanelCanvasLink,
}
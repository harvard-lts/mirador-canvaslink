import PropTypes from "prop-types";

/** Wraps the info panel's related links to optionally append canvas permalinks */
const InfoPanelCanvasLink = ({
  config,
  manifestId,
  visibleCanvases,
  TargetComponent,
  targetProps,
}) => {
  const { getCanvasLink, infoPanelEnabled } = config || {};

  // Generate the canvas link if we have the necessary data
  const canvasLink =
    getCanvasLink && manifestId && visibleCanvases && visibleCanvases.length > 0
      ? getCanvasLink(manifestId, visibleCanvases)
      : null;
  // Create object link without page parameter for "Link to this object"
  const objectLink = canvasLink ? canvasLink.split("?")[0] : null;

  return (
    <>
      <TargetComponent {...targetProps} />
      {infoPanelEnabled && canvasLink && (
        <>
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
      )}
    </>
  );
};

InfoPanelCanvasLink.propTypes = {
  config: PropTypes.shape({
    getCanvasLink: PropTypes.func,
    infoPanelEnabled: PropTypes.bool,
  }),
  manifestId: PropTypes.string,
  visibleCanvases: PropTypes.arrayOf(PropTypes.object),
  TargetComponent: PropTypes.elementType.isRequired,
  targetProps: PropTypes.object,
};

InfoPanelCanvasLink.defaultProps = {
  config: undefined,
  manifestId: undefined,
  visibleCanvases: [],
  targetProps: {},
};

export default {
  target: "ManifestRelatedLinks",
  mode: "wrap",
  component: InfoPanelCanvasLink,
};

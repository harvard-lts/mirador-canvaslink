import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
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
          {/*
            Render the labels and links as real MUI components (via the
            `component` prop to keep the semantic <dt>/<dd> markup) rather than
            plain elements with hand-copied "MuiTypography-*"/"MuiLink-*" class
            strings. Under MUI 5+ (Emotion) those class NAMES carry no styling on
            their own — the styles live in runtime-generated classes — so copied
            strings render with the browser default serif instead of the theme
            font. Using the components makes the labels/links inherit the active
            Mirador theme, matching the panel's other (Mirador-rendered) links.
          */}
          <Typography component="dt" variant="subtitle2">
            Link to this object
          </Typography>
          {objectLink && (
            <Typography component="dd" variant="body1">
              <Link
                underline="always"
                target="_blank"
                rel="noopener noreferrer"
                href={objectLink}
              >
                {objectLink}
              </Link>
            </Typography>
          )}
          <Typography component="dt" variant="subtitle2">
            Canvas permalink
          </Typography>
          {canvasLink && (
            <Typography component="dd" variant="body1">
              <Link
                underline="always"
                target="_blank"
                rel="noopener noreferrer"
                href={canvasLink}
              >
                {canvasLink}
              </Link>
            </Typography>
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

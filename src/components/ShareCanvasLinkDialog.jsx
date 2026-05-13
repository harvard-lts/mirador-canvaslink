import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useTranslation } from "mirador";
import PropTypes from "prop-types";
import { useState } from "react";

import CopyToClipboard from "./dialog/CopyToClipboard.jsx";
import RightsInformation from "./dialog/RightsInformation.jsx";
import ShareButton from "./dialog/ShareButton.jsx";

const supportsClipboard = "clipboard" in navigator;

const ShareCanvasLinkDialog = ({
  config,
  containerId,
  manifestId,
  visibleCanvases = [],
  label = "",
  rights = [],
  updateConfig,
}) => {
  const { t } = useTranslation();
  const { dialogOpen, enabled, showRightsInformation, getCanvasLink } = config;
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  if (!enabled || !dialogOpen || visibleCanvases.length === 0) {
    return null;
  }
  const closeDialog = () =>
    updateConfig({
      ...config,
      dialogOpen: false,
    });
  const canvasLink = getCanvasLink(manifestId, visibleCanvases);
  const getPreviewUrl = (width) =>
    `${visibleCanvases[0]?.imageServiceIds[0]}/full/${width},/0/default.jpg`;

  return (
    <Dialog
      container={document.querySelector(`#${containerId} .mirador-viewer`)}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      open={dialogOpen}
      onClose={closeDialog}
    >
      <DialogTitle>
        <Typography variant="h4">
          <Box fontWeight="fontWeightBold">{t("canvasLink.shareLink")}</Box>
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {copiedToClipboard && (
          <Alert
            sx={{ mb: 1 }}
            closeText={t("canvasLink.close")}
            onClose={() => setCopiedToClipboard(false)}
            severity="success"
          >
            {t("canvasLink.copiedToClipboard")}
          </Alert>
        )}
        <TextField
          fullWidth
          InputProps={{
            endAdornment: (
              <CopyToClipboard
                onCopy={() => {
                  navigator.clipboard.writeText(canvasLink);
                  setCopiedToClipboard(true);
                  setTimeout(() => setCopiedToClipboard(false), 3000);
                }}
                supported={supportsClipboard}
              />
            ),
            readOnly: true,
          }}
          size="small"
          value={canvasLink}
          variant="outlined"
        />
        {showRightsInformation && <RightsInformation rights={rights} />}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
        <ButtonGroup sx={{ flexWrap: "wrap" }}>
          {["envelope", "facebook", "pinterest", "twitter", "whatsapp"].map(
            (p) => (
              <ShareButton
                key={p}
                canvasLink={canvasLink}
                label={label}
                provider={p}
                thumbnailUrl={getPreviewUrl(250)}
                title={t(`canvasLink.share.${p}`)}
              />
            ),
          )}
        </ButtonGroup>
        <div style={{ flex: "1 0 0" }} />
        <Button color="primary" onClick={closeDialog}>
          {t("canvasLink.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ShareCanvasLinkDialog.propTypes = {
  config: PropTypes.shape({
    dialogOpen: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,
    showRightsInformation: PropTypes.bool.isRequired,
    getCanvasLink: PropTypes.func.isRequired,
  }).isRequired,
  containerId: PropTypes.string.isRequired,
  label: PropTypes.string,
  manifestId: PropTypes.string.isRequired,
  rights: PropTypes.arrayOf(PropTypes.string),
  updateConfig: PropTypes.func.isRequired,
  visibleCanvases: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      imageServiceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ),
};

export default ShareCanvasLinkDialog;

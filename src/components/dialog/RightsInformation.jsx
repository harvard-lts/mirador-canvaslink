import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import PropTypes from "prop-types";

const RightsInformation = ({ rights, t }) => {
  if (!rights.length) {
    return null;
  }
  return (
    <Alert sx={{ mt: 2 }} severity="warning">
      <span>{t("canvasLink.noteRights", { count: rights.length })}: </span>
      {rights.length === 1 ? (
        <Link href={rights[0]} rel="noopener" target="_blank">
          {rights[0]}
        </Link>
      ) : (
        <ul>
          {rights.map((link) => (
            <li key={link}>
              <Link href={link} rel="noopener" target="_blank">
                {link}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Alert>
  );
};

RightsInformation.propTypes = {
  rights: PropTypes.arrayOf(PropTypes.string).isRequired,
  t: PropTypes.func.isRequired,
};

export default RightsInformation;

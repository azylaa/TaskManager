import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ malePercentage, femalePercentage, size = 120 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Calculate the angles for the progress
  const totalAngle = 360;
  const maleAngle = (malePercentage / 100) * totalAngle;
  const femaleAngle = (femalePercentage / 100) * totalAngle;
  const remainingAngle = totalAngle - maleAngle - femaleAngle;

  return (
    <Box
      sx={{
        background: `conic-gradient(
            ${colors.blueAccent[500]} 0deg ${maleAngle}deg, 
            ${colors.greenAccent[500]} ${maleAngle}deg ${maleAngle + femaleAngle}deg,
            ${colors.primary[400]} ${maleAngle + femaleAngle}deg ${totalAngle}deg
          )`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default ProgressCircle;

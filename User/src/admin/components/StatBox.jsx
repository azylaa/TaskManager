import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ malePercentage, femalePercentage }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 5px">
      <Box display="flex" justifyContent="left" alignItems="left">
        <Box>
          <Typography
            variant="h4"
            fontWeight="600"
            sx={{ color: colors.grey[100] }}
          >
            Gender Distribution of Members
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box ml="50px" mt="25px">
          <ProgressCircle
            malePercentage={malePercentage}
            femalePercentage={femalePercentage}
          />
          <Box ml="-55px" mt="30px" display="flex" alignItems="center">
            <Box
              width="10px"
              height="10px"
              borderRadius="50%"
              bgcolor={colors.blueAccent[500]}
              mr="5px"
              sx={{ flexShrink: 0 }}
            />
            <Typography m="0 5px" variant="h5" sx={{ color: colors.grey[100] }}>
              {`Male: ${malePercentage.toFixed(2)}%`}
            </Typography>
            <Box
              width="10px"
              height="10px"
              borderRadius="50%"
              bgcolor={colors.greenAccent[500]}
              mr="5px"
              sx={{ flexShrink: 0 }}
            />
            <Typography m="0 5px" variant="h5" sx={{ color: colors.grey[100] }}>
              {`Female: ${femalePercentage.toFixed(2)}%`}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;

import { Link } from "react-router-dom";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { Divider } from "@mui/material";

const mainListItems = [
  { text: 'Lista tabel', path: '/' },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton component={Link} to={item.path} selected={index === 0}>
              <ListItemText
                primary={item.text}
                slotProps={{
                  primary: { sx: { fontSize: "1.2rem" } },
                }}
              />
            </ListItemButton>
            <Divider />
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
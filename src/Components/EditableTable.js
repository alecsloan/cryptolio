import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import {AddBox as AddBoxIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon} from "@material-ui/icons";
import {InputAdornment, TextField} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  selectTableCell: {
    width: 60
  },
  tableCell: {
    width: 130,
    height: 40
  },
  input: {
    width: 130,
    height: 40
  }
}));

var currencySymbol;

const createData = (id, sellingPoint, percentToSell, sellAmount, remainingAmount, profit, totalProfit) => ({
  id: id,
  sellingPoint,
  percentToSell,
  sellAmount,
  remainingAmount,
  profit,
  totalProfit
});

const CustomTableCell = ({ row, name, onChange, type }) => {
  const classes = useStyles();
  const { isEditMode } = row;

  var inputProps;
  var formattedValue;

  if (type === "percent") {
    inputProps = {endAdornment: <InputAdornment position="end">%</InputAdornment>}
    formattedValue = row[name] || 0 + "%";
  }
  else if (type === "number") {
    inputProps = null
    formattedValue = row[name] || 0;
  }
  else {
    inputProps = {startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>}
    formattedValue = currencySymbol + row[name] || 0;
  }

  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <TextField
          InputProps={inputProps}
          value={row[name]}
          name={name}
          onChange={e => onChange(e, row)}
          className={classes.input}
          variant="outlined"
        />
      ) : (
        formattedValue
      )}
    </TableCell>
  );
};

function EditableTable(props) {
  function setRows(rows) {
    props.setRows(rows, props.symbol)
  }

  var rows = props.rows || [];

  currencySymbol = props.currencySymbol;

  const [previous, setPrevious] = React.useState({});
  const classes = useStyles();

  const addRow = () => {
    setRows(rows.push(createData(rows.length, 0, 0, 0, 0, 0, 0)));

    onToggleEditMode(rows.length);
  }

  const onToggleEditMode = id => {
    setRows(
      rows.map(row => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      })
    );
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious(state => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onRevert = id => {
    const index = rows.findIndex(row => row.id === id);

    setRows(rows.splice(index,1));
    setPrevious(state => {
      delete state[id];
      return state;
    });
    onToggleEditMode(id);
  };

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell align="left">Selling Point</TableCell>
            <TableCell align="left">Percent to sell</TableCell>
            <TableCell align="left">Sell amount</TableCell>
            <TableCell align="left">Remaining Amount</TableCell>
            <TableCell align="left">Profit</TableCell>
            <TableCell align="left">Total Profit</TableCell>
            <TableCell align="left" />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <CustomTableCell {...{ row, name: "sellingPoint", onChange }} />
              <CustomTableCell {...{ row, name: "precentToSell", onChange, type: "percent" }} />
              <CustomTableCell {...{ row, name: "sellAmount", onChange }} />
              <CustomTableCell {...{ row, name: "remainingAmount", onChange, type: "number" }} />
              <CustomTableCell {...{ row, name: "profit", onChange }} />
              <CustomTableCell {...{ row, name: "totalProfit", onChange }} />
              <TableCell className={classes.selectTableCell}>
                {row.isEditMode ? (
                  <>
                    <IconButton
                      aria-label="done"
                      onClick={() => onToggleEditMode(row.id)}
                    >
                      <DoneIcon />
                    </IconButton>
                    <IconButton
                      aria-label="revert"
                      onClick={() => onRevert(row.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    aria-label="delete"
                    onClick={() => onToggleEditMode(row.id)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
          <TableRow key={"add"}>
            <TableCell className={classes.selectTableCell}>
              <IconButton
                aria-label="delete"
                onClick={() => addRow()}
              >
                <AddBoxIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

export default EditableTable;
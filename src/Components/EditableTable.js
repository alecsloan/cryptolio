import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import {AddBox as AddBoxIcon, Delete as DeleteIcon} from "@material-ui/icons";
import {InputAdornment, TextField} from "@material-ui/core";
import * as Util from "../Util/index";

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: 50,
    marginTop: theme.spacing(3),
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: 800,
    overflowX: "auto",
    width: "90%"
  },
  table: {
    width: "99%"
  },
  tableCell: {
    maxWidth: 175,
    width: 80,
    height: 40,
    padding: 4
  },
  input: {
    maxWidth: 200,
    minWidth: 130,
    height: 70,
    padding: 4
  },
  iconColumn: {
    maxWidth: 50,
    padding: 0,
    width: 50
  }
}));

var settings;

const createData = (id, sellingPoint, percentToSell, sellAmount, remainingAmount, profit, totalProfit) => ({
  id: id,
  sellingPoint,
  percentToSell,
  sellAmount,
  remainingAmount,
  profit,
  totalProfit
});

const CustomTableCell = ({ row, name, onChange, type, editable }) => {
  const classes = useStyles();

  var inputProps;
  var formattedValue;

  if (type === "percent") {
    inputProps = {endAdornment: <InputAdornment position="end">%</InputAdornment>}
    formattedValue = Util.getLocalizedPercent(row[name] || 0);
  }
  else if (type === "number") {
    inputProps = null;
    formattedValue = Util.getLocalizedNumber(row[name] || 0, settings);
  }
  else {
    inputProps = {startAdornment: <InputAdornment position="start">{Util.getCurrencySymbol(settings.currency)}</InputAdornment>}
    formattedValue = Util.getLocalizedPrice(row[name] || 0, settings);
  }

  return (
    <TableCell align="center" className={editable ? classes.input : classes.tableCell}>
      {editable ? (
        <TextField
          className={classes.input}
          InputProps={inputProps}
          name={name}
          onChange={e => onChange(e, row)}
          size="small"
          value={row[name]}
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

  settings = props.settings;

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
        var sellAmount = row["sellAmount"];
        var remainingAmount = row["remainingAmount"];
        var sellingPoint = row["sellingPoint"];

        if (name === "percentToSell") {
          var previousRemainingAmount = props.holdings

          if (row.id !== 0) {
            previousRemainingAmount = rows[id - 1]["remainingAmount"];
          }

          sellAmount = (value * .01) * props.holdings;

          remainingAmount = previousRemainingAmount - sellAmount;
        }
        else if (name === "sellingPoint") {
          sellingPoint = value;
        }

        var profit = sellAmount * sellingPoint;

        var totalProfit = profit;

        if (row.id !== 0) {
          totalProfit += rows[id - 1]["totalProfit"];
        }

        return {
          ...row,
          [name]: value,
          sellAmount: sellAmount,
          remainingAmount: remainingAmount,
          profit: profit,
          totalProfit: totalProfit
        };
      }
      return row;
    });
    setRows(newRows);
  };

  const removeRow = id => {
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
            <TableCell align="center">Selling Point</TableCell>
            <TableCell align="center">Percent to sell</TableCell>
            <TableCell align="center">Sell amount</TableCell>
            <TableCell align="center">Remaining Amount</TableCell>
            <TableCell align="center">Profit</TableCell>
            <TableCell align="center">Total Profit</TableCell>
            <TableCell align="center" className={classes.iconColumn}>
              <IconButton
                aria-label="add row"
                onClick={() => addRow()}
              >
                <AddBoxIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <CustomTableCell {...{ row, name: "sellingPoint", onChange, editable: true }} />
              <CustomTableCell {...{ row, name: "percentToSell", onChange, type: "percent", editable: true }} />
              <CustomTableCell {...{ row, name: "sellAmount", onChange, type: "number" }} />
              <CustomTableCell {...{ row, name: "remainingAmount", onChange, type: "number" }} />
              <CustomTableCell {...{ row, name: "profit", onChange }} />
              <CustomTableCell {...{ row, name: "totalProfit", onChange }} />
              <TableCell align="center" className={classes.iconColumn}>
                <IconButton
                  aria-label="revert"
                  onClick={() => removeRow(row.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default EditableTable;
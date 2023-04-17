import React, { useState, useEffect } from "react";
import "./Table.css";
import Caret from "../../assets/Icons/Caret";
import getMedalData from "../../API/MedalData";

const Table = ({ id, sortingKey }) => {
  console.log("sortingkey is", sortingKey);
  const [sortData, setSortedData] = useState([]);
  const [sort, setSort] = useState({
    keyToSort: sortingKey ? sortingKey : "gold",
    direction: "desc",
  });
  const [error, SetError] = useState("");
  useEffect(() => {
    getData();
  }, []);
  const headers = [
    {
      id: 1,
      KEY: "code",
      LABEL: "code",
    },
    {
      id: 2,
      KEY: "gold",
      LABEL: "gold",
    },
    {
      id: 3,
      KEY: "silver",
      LABEL: "silver",
    },
    {
      id: 4,
      KEY: "bronze",
      LABEL: "bronze",
    },
    {
      id: 5,
      KEY: "total",
      LABEL: "total",
    },
  ];

  const getData = async () => {
    try {
      const data = await getMedalData();
      const newData = data?.data?.map((item) => {
        return { ...item, total: item.silver + item.gold + item.bronze };
      });
      setSortedData(newData);
      SetError("");
    } catch (e) {
      SetError(e.message);
    }
  };

  function handleHeaderClick(header) {
    if (header.KEY === "code") {
      return;
    }
    setSort({
      keyToSort: header.KEY,
      direction:
        headers.KEY === sort.keyToSort
          ? sort.direction === "asc"
            ? "desc"
            : "asc"
          : "desc",
    });
  }
  function tieBraker(a, b) {
    return sort.keyToSort !== "gold"
      ? a["gold"] - b["gold"]
      : a["silver"] - b["silver"];
  }
  function getSortedArray(arrayToSort) {
    if (sort.direction === "asc") {
      return arrayToSort.sort((a, b) => {
        if (a[sort.keyToSort] - b[sort.keyToSort] !== 0) {
          return a[sort.keyToSort] - b[sort.keyToSort];
        } else return tieBraker(a, b);
      });
    }
    return arrayToSort.sort((a, b) => {
      if (b[sort.keyToSort] - a[sort.keyToSort] !== 0) {
        return b[sort.keyToSort] - a[sort.keyToSort];
      } else return tieBraker(b, a);
    });
  }
  return (
    <div>
      {error ? (
        <span>I am so sorry , here is the issue : {error}</span>
      ) : (
        <table>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} onClick={() => handleHeaderClick(header)}>
                  <div className="header-container">
                    <span className={header.LABEL}>
                      {header.LABEL === "total" ? "Total" : ""}
                    </span>

                    {header.KEY === sort.keyToSort && (
                      <Caret
                        direction={
                          sort.keyToSort === header.KEY ? sort.direction : "asc"
                        }
                      ></Caret>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getSortedArray(sortData)
              ?.slice(0, 10)
              ?.map((row, rowIndex) => {
                return (
                  <tr keys={rowIndex}>
                    {headers.map((header, index) => {
                      if (header.KEY === "code") {
                        return (
                          <>
                            <td keys={index} className="countryCode">
                              <span>{` ${rowIndex + 1} ${
                                row[header.KEY]
                              }`}</span>

                              <span
                                className={`${row[header.KEY]} flagImage`}
                              ></span>
                            </td>
                          </>
                        );
                      }
                      return <td keys={index}>{row[header.KEY]}</td>;
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;

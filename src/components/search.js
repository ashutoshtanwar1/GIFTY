import { useState, useCallback } from "react";
import DisplayGIF from "./displaygif.js";
import DisplaySticker from "./displaysticker.js";

import { debounce } from "lodash";

function Search() {
  const [gifType, setGifType] = useState(0);

  const [userQuery, setUserQuery] = useState("");

  const [fetchQuery, setFetchQuery] = useState("");

  const delayedQuery = useCallback(() => {
    debounce((q) => setFetchQuery(q), 500);
  }, []);

  const onChange = (e) => {
    setUserQuery(
      e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
    );
    delayedQuery(e.target.value);
  };

  return (
    <div>
      <div className="p-2 input-group input-group-lg">
        <input
          className="text-center form-control"
          placeholder={
            "Search " + (gifType === 1 ? "Stickers" : "GIFs") + "  ..."
          }
          id="search-box"
          value={userQuery}
          onChange={onChange}
        />
      </div>

      <div className="text-center" id="type-sel">
        <button
          className="p-2 border border-1 rounded-3"
          onClick={() => setGifType(0)}
        >
          GIFS
        </button>
        <input
          type="range"
          className="p-2 form-range"
          min="0"
          max="1"
          id="customRange2"
          value={gifType}
          onChange={(e) => {
            setGifType(+e.target.value);
          }}
        />
        <button
          className="p-2 border border-1 rounded-3"
          onClick={() => setGifType(1)}
        >
          STICKERS
        </button>
      </div>

      {!gifType && <DisplayGIF fetchQuery={fetchQuery} />}
      {!!gifType && <DisplaySticker fetchQuery={fetchQuery} />}
    </div>
  );
}

export default Search;

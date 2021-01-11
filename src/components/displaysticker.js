/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";

const DisplaySticker = (props) => {
  const [arrSticker, setSticker] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const [totalCount, setTotalount] = useState(0);

  const [offset, setOffset] = useState(0);

  const [finalArr, setFinalArr] = useState([]);

  const [fixedWidth, setFixedWidth] = useState(0);

  const fetchTrendSticker = async (isAppendData) => {
    const res = await fetch(
      `https://api.giphy.com/v1/stickers/trending?api_key=FSPfNME2Zi5hVag5o7doCw8G9gtyVJGL&offset=${
        +offset * 25
      }&limit=25&rating=g`
    );
    const data = await res.json();
    setTotalount(data.pagination.total_count);
    setOffset(offset + 1);
    if (isAppendData)
      setSticker(() => {
        return [...arrSticker, ...data.data];
      });
    else setSticker(data.data);
  };

  const fetchQuerySticker = async (isAppendData) => {
    const res = await fetch(
      `https://api.giphy.com/v1/stickers/search?api_key=FSPfNME2Zi5hVag5o7doCw8G9gtyVJGL&q=${
        props.fetchQuery
      }&offset=${+offset * 25}&limit=25&rating=g&lang=en`
    );
    const data = await res.json();
    setTotalount(data.pagination.total_count);
    setOffset(offset + 1);
    if (isAppendData)
      setSticker(() => {
        return [...arrSticker, ...data.data];
      });
    else setSticker(data.data);
  };

  // Fetch trending gifs for the first time
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", changeImageSize);
  }, []);

  // Fetch data whenever the props changes
  useEffect(() => {
    if (props.fetchQuery.length === 0) {
      fetchTrendSticker(false);
      return;
    }
    setSticker([]);
    setIsFetching(false);
    setOffset(0);
    fetchQuerySticker(false);
  }, [props.fetchQuery]);

  const handleScroll = () => {
    if (
      Math.ceil(window.innerHeight + document.documentElement.scrollTop) !==
        document.documentElement.offsetHeight ||
      isFetching
    )
      return;
    setIsFetching(true);
  };

  // Fetching more data after scrolling
  useEffect(() => {
    if (!isFetching) return;
    if (props.fetchQuery.length !== 0) fetchQuerySticker(true);
    else fetchTrendSticker(true);
    setIsFetching(false);
  }, [isFetching]);

  const reorder = (col) => {
    const ans = [];
    for (let i = 0; i < col; i++) {
      for (let j = 0; j + i < arrSticker.length; j += col) {
        ans.push(arrSticker[i + j]);
      }
    }
    setFinalArr(ans);
  };

  useEffect(() => {
    if (window.outerWidth > 1200) reorder(4);
    else if (window.outerWidth > 992) reorder(3);
    else if (window.outerWidth > 794) reorder(2);
    else reorder(1);
  }, [arrSticker]);

  const changeImageSize = () => {
    if (window.outerWidth > 1200) setFixedWidth(390);
    else if (window.outerWidth > 992) setFixedWidth(306);
    else setFixedWidth(161);
  };

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          paddingTop: "4rem",
          paddingBottom: "1.5rem",
        }}
      >
        <h1>{!props.fetchQuery.length ? "Trending " : props.fetchQuery}</h1>
        <div>{totalCount} STICKERS</div>
      </div>
      <div className="masonry">
        {finalArr.map((val, i) => {
          return (
            val.images && (
              <div className="grid" key={i}>
                <LazyLoadImage
                  key={i}
                  alt="..."
                  height={
                    (fixedWidth / val.images.original.width) *
                    val.images.original.height
                  }
                  src={val.images.original.url}
                  width={fixedWidth}
                />
                <div className="grid-body">
                  <div className="relative">
                    <a
                      className="grid-link"
                      target="_blank"
                      rel="noreferrer"
                      href={val.images.original.url}
                    >
                      {" "}
                    </a>
                    <h1 className="grid-title">{val.title}</h1>
                    <p className="grid-author">{val.username}</p>
                  </div>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default DisplaySticker;

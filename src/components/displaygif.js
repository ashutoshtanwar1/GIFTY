/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

import { LazyLoadImage } from "react-lazy-load-image-component";

const DisplayGIF = (props) => {
  const [arrGIF, setGIF] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const [totalCount, setTotalount] = useState(0);

  const [offset, setOffset] = useState(0);

  const [finalArr, setFinalArr] = useState([]);

  const fetchTrendGIF = async (isAppendData) => {
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/trending?api_key=FSPfNME2Zi5hVag5o7doCw8G9gtyVJGL&offset=${
        +offset * 16
      }&limit=16&rating=g`
    );
    const data = await res.json();
    setTotalount(data.pagination.total_count);
    setOffset(offset + 1);
    if (isAppendData)
      setGIF(() => {
        return [...arrGIF, ...data.data];
      });
    else setGIF(data.data);
  };

  const fetchQueryGIF = async (isAppendData) => {
    const res = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=FSPfNME2Zi5hVag5o7doCw8G9gtyVJGL&q=${
        props.fetchQuery
      }&offset=${+offset * 16}&limit=16&rating=g&lang=en`
    );
    const data = await res.json();
    setTotalount(data.pagination.total_count);
    setOffset(offset + 1);
    if (isAppendData)
      setGIF(() => {
        return [...arrGIF, ...data.data];
      });
    else setGIF(data.data);
  };

  // Fetch trending gifs for the first time
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  // Fetch data whenever the props changes
  useEffect(() => {
    if (props.fetchQuery.length === 0) {
      fetchTrendGIF(false);
      return;
    }
    setGIF([]);
    setIsFetching(false);
    setOffset(0);
    fetchQueryGIF(false);
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
    if (props.fetchQuery.length !== 0) fetchQueryGIF(true);
    else fetchTrendGIF(true);
    setIsFetching(false);
  }, [isFetching]);

  const reorder = (col) => {
    const ans = [];
    for (let i = 0; i < col; i++) {
      for (let j = 0; j + i < arrGIF.length; j += col) {
        ans.push(arrGIF[i + j]);
      }
    }
    setFinalArr(ans);
  };

  useEffect(() => {
    if (window.outerWidth > 1200) reorder(4);
    else if (window.outerWidth > 992) reorder(3);
    else if (window.outerWidth > 794) reorder(2);
    else reorder(1);
  }, [arrGIF]);

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
        <div>{totalCount} GIFs</div>
      </div>
      <div className="masonry">
        {finalArr.map((val, i) => {
          return (
            val.images && (
              <div className="grid" key={i}>
                <LazyLoadImage
                  key={i}
                  alt="..."
                  height={val.images.original.height}
                  visibleByDefault={true}
                  src={val.images.original.url}
                  width={val.images.original.width}
                  delayTime={0}
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

export default DisplayGIF;

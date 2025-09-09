import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faFilePen,
  faArrowRightToBracket,
  faRightToBracket,
  faRightFromBracket,
  faMagnifyingGlass,
  faPenToSquare,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ isAuth }) => {
  return (
    <nav>
      <Link to={"/"}>
        <span>
          <FontAwesomeIcon icon={faHouse} />
          エピソード
        </span>
        一覧
      </Link>
      {!isAuth ? (
        <Link to={"/login"}>
          <FontAwesomeIcon icon={faRightToBracket} />
          ログイン
        </Link>
      ) : (
        <>
          <Link to={"/search"}>
            <span>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              エピソード
            </span>
            検索
          </Link>
          <Link to={"/createpost"}>
            <span>
              <FontAwesomeIcon icon={faPenToSquare} />
              エピソード
            </span>
            追加
          </Link>
          <Link to={"/friends"}>
            <span>
              <FontAwesomeIcon icon={faUsers} />
            </span>
            ともだち
          </Link>
          <Link to={"/logout"}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span>ログアウト</span>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
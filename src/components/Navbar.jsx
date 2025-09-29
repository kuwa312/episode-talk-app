import React from "react";
import { Link } from "react-router-dom";
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
    <nav className="flex justify-center items-center 
  h-12 gap-8 bg-orange-400
  sm:h-12 sm:gap-9
  xs:h-[48px] xs:gap-[35px]">


      <Link className="link" to={"/"}>
        <span className="hidden sm:inline">
          <FontAwesomeIcon icon={faHouse} />
          エピソード
        </span>
        一覧
      </Link>
      {!isAuth ? (
        <Link className="link" to={"/login"}>
          <FontAwesomeIcon icon={faArrowRightToBracket} />
          ログイン
        </Link>
      ) : (
        <>
          <Link className="link" to={"/search"}>
            <span className="hidden sm:inline">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              エピソード
            </span>
            検索
          </Link>
          <Link className="link" to={"/createpost"}>
            <span className="hidden sm:inline">
              <FontAwesomeIcon icon={faPenToSquare} />
              エピソード
            </span>
            追加
          </Link>
          <Link className="link" to={"/friends"}>
            <span className="hidden sm:inline">
              <FontAwesomeIcon icon={faUsers} />
            </span>
            友達
          </Link>
          <Link className="link" to={"/tags"}>
            {/* <span className="hidden sm:inline"> */}
              {/* <FontAwesomeIcon icon={faUsers} /> */}
            {/* </span> */}
            タグ
          </Link>
          <Link className="link" to={"/logout"}>
            <FontAwesomeIcon icon={faArrowRightToBracket} />
            <span className="hidden sm:inline">ログアウト</span>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";

import {
  Navbar,
  NavLink
} from "reactstrap";

import { closeSidebar, openSidebar } from "../../actions/navigation";
import MenuIcon from "../Icons/HeaderIcons/MenuIcon";
// import SearchBarIcon from "../Icons/HeaderIcons/SearchBarIcon";
// import SearchIcon from "../Icons/HeaderIcons/SearchIcon";

import s from "./Header.module.scss";
import "animate.css";

const Header = (props) => {
  const toggleSidebar = () => {
    if (props.sidebarOpened) {
      props.dispatch(closeSidebar());
    } else {
      const paths = props.location.pathname.split('/');
      paths.pop();
      props.dispatch(openSidebar());
    }
  }

  return (
    <Navbar className={`${s.root} d-print-none`}>
      <div>
        <NavLink
          onClick={() => toggleSidebar()}
          className={`d-md-none mr-3 ${s.navItem}`}
          href="#"
        >
          <MenuIcon className={s.menuIcon} />
        </NavLink>
      </div>
      {/* <Form className="d-none d-sm-block" inline>
        <FormGroup>
          <InputGroup className='input-group-no-border'>
            <Input id="search-input" placeholder="Search Dashboard" className='focus'/>
            <InputGroupAddon addonType="prepend">
              <span>
                <SearchBarIcon/>
              </span>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
      </Form> */}
    </Navbar>
  )
}

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  sidebarOpened: PropTypes.bool,
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarStatic: store.navigation.sidebarStatic,
  };
}

export default withRouter(connect(mapStateToProps)(Header));


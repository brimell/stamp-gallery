import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Button} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import s from "./Sidebar.module.scss";
import LinksGroup from "./LinksGroup/LinksGroup.js";
import { changeActiveSidebarItem } from "../../actions/navigation.js";
import cn from "classnames";
import * as Icons from "@material-ui/icons";

const Sidebar = (props) => {

  const [burgerSidebarOpen, setBurgerSidebarOpen] = useState(false)

  useEffect(() => {
    if (props.sidebarOpened) {
      setBurgerSidebarOpen(true)
    } else {
      setTimeout(() => {
        setBurgerSidebarOpen(false)
      }, 0);
    }
  }, [props.sidebarOpened])

  return (
    <nav className={cn(s.root, {[s.sidebarOpen]: burgerSidebarOpen})} >
      <header className={s.logo}>
        <span className={s.title}>STAMP ALBUM</span>
      </header>
      <ul className={s.nav}>
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Dashboard"
          isHeader
          iconName={<i className={'eva eva-home-outline'}/>}
          link="/dashboard"
          index="dashboard"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Books"
          isHeader
          iconName={<i className={'eva eva-book-outline'}/>}
          link="/books"
          index="books"
          childrenLinks={[
            {
              header: 'A', link: '/books/a',
            },
            {
              header: 'B', link: '/books/b',
            },
            {
              header: 'C', link: '/books/c',
            },
          ]}
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Countries"
          isHeader
          iconName={<Icons.Flag />}
          link="/countries"
          index="countries"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Globe"
          isHeader
          iconName={<i className={'eva eva-globe-outline'}/>}
          link="/globe"
          index="globe"
        />
        <h5 className={s.navTitle}>other</h5>
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="UI"
          isHeader
          iconName={<i className={'eva eva-cube-outline'}/>}
          link="/uielements"
          index="uielements"
          childrenLinks={[
            {
              header: 'Charts', link: '/ui-elements/charts',
            },
            {
              header: 'Icons', link: '/ui-elements/icons',
            },
            {
              header: 'Maps', link: '/ui-elements/maps',
            },
          ]}
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Typography"
          isHeader
          iconName={<i className={'eva eva-text-outline'}/>}
          link="/typography"
          index="typography"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Tables"
          isHeader
          iconName={<i className={'eva eva-grid-outline'}/>}
          link="/tables"
          index="tables"
        />
        <LinksGroup
          onActiveSidebarItemChange={activeItem => props.dispatch(changeActiveSidebarItem(activeItem))}
          activeItem={props.activeItem}
          header="Notifications"
          isHeader
          iconName={<i className={'eva eva-bell-outline'}/>}
          link="/notifications"
          index="notifications"
        />

      </ul>
      {/* <div className="bg-widget d-flex mt-auto ml-1">
        <Button className="rounded-pill my-3 body-2 d-none d-md-block" type="submit" color="secondary-red">big red button</Button>
      </div> */}
    </nav>
  );
}

Sidebar.propTypes = {
  sidebarOpened: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
  activeItem: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    activeItem: store.navigation.activeItem,
  };
}

export default withRouter(connect(mapStateToProps)(Sidebar));

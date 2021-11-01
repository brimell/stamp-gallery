import React from "react";
import $ from 'jquery';
import {DropdownItem} from "reactstrap";

const logEvent = () => {
    var eventTxt
    $('#logEvent').ready(function() {
        eventTxt = $('#logEvent').innerHTML
    })
    console.log('event text: '+eventTxt);
    return (
    <DropdownItem><span>{eventTxt}</span></DropdownItem>
    )

}

export default logEvent

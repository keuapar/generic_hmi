import { connect } from 'react-redux'
import ControlBar from '../ControlBar'
//import SoftButtons from '../SoftButtons'
import SoftButtonsBody from '../Templates/Shared/SoftButtons'
import AlertButtonsBody from '../AlertButtons'
import uiController from '../Controllers/UIController'

import iconSeekLeft from '../../img/icons/icon-seek-left.svg';
import iconSeekRight from '../../img/icons/icon-seek-right.svg';
import iconPlay from '../../img/icons/icon-play.svg';
import iconPause from '../../img/icons/icon-pause.svg';
import iconPlayPause from '../../img/icons/icon-play-pause.svg';
import iconStop from '../../img/icons/icon-stop.svg';

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var subscribedButtons = {}
    var softButtons = []
    var alertButtons = []
    var app = {}
    var graphicPresent
    if (activeApp) {
        subscribedButtons = state.ui[activeApp].subscribedButtons
        softButtons = state.ui[activeApp].softButtons
        app = state.ui[activeApp]
        graphicPresent = state.ui[activeApp].graphic ? true : false
    }

    var buttons = []
    if (softButtons.length > 0) {
        buttons.push({
            class: "tertiary",
            name: "CUSTOM_BUTTON",
            image: softButtons[0].image ? softButtons[0].image.value : undefined,
            imageType: softButtons[0].image ? softButtons[0].image.imageType : undefined,
            id: softButtons[0].softButtonID,
            isTemplate: softButtons[0].image ? softButtons[0].image.isTemplate : null
        })
    }
    if (subscribedButtons.SEEKLEFT === true) {
        buttons.push({
            class: "secondary",
            name: "SEEKLEFT",
            icon: iconSeekLeft
        })
    }
    if (subscribedButtons.OK === true || subscribedButtons.PLAY_PAUSE === true) {
        var buttonName = ""
        if (subscribedButtons.PLAY_PAUSE === true) {
            buttonName = "PLAY_PAUSE"
        } else {
            buttonName = "OK"
        }
        if (app.audioStreamingIndicator) {
            if (app.audioStreamingIndicator === "PLAY") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: iconPlay
                })
            } else if (app.audioStreamingIndicator === "PAUSE") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: iconPause
                })                
            } else if (app.audioStreamingIndicator === "STOP") {
                buttons.push({
                    class: "square",
                    name: buttonName,
                    icon: iconStop
                })                
            } else if (app.audioStreamingIndicator === "PLAY_PAUSE") {
                buttons.push({
                    class: "double",
                    name: buttonName,
                    icon: iconPlayPause
                })                
            } else {
                buttons.push({
                    class: "double",
                    name: buttonName,
                    icon: iconPlayPause
                })                    
            }
        } 
        else if (app.updateMode) {
            if (app.updateMode === "COUNTUP") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: iconPause
                })                    
            } else if (app.updateMode === "COUNTDOWN") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: iconPause
                })                    
            } else if (app.updateMode === "RESUME") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: iconPause
                })                    
            } else if (app.updateMode === "PAUSE") {
                buttons.push({
                    class: "primary",
                    name: buttonName,
                    icon: iconPlay
                })                    
            } else {
                buttons.push({
                    class: "double",
                    name: buttonName,
                    icon: iconPlayPause
                })                    
            }
        } else {
            buttons.push({
                class: "double",
                name: buttonName,
                icon: iconPlayPause
            })                    
        }
    }
    if (subscribedButtons.SEEKRIGHT === true) {
        buttons.push({
            class: "secondary",
            name: "SEEKRIGHT",
            icon: iconSeekRight
        })
    }
    if (softButtons.length > 1) {
        buttons.push({
            class: "tertiary",
            name: "CUSTOM_BUTTON",
            image: softButtons[1].image ? softButtons[1].image.value : undefined,
            imageType: softButtons[1].image ? softButtons[1].image.imageType : undefined,
            id: softButtons[1].softButtonID,
            isTemplate: softButtons[1].image ? softButtons[1].image.isTemplate : null
        })
    }

    for(var key in state.ui) {
        if(state.ui[key].alert.showAlert) {
            alertButtons = state.ui[key].alert.softButtons
            if(alertButtons) {
                for (var i in alertButtons) {
                    alertButtons[i].msgID = state.ui[key].alert.msgID
                    //Set appID for app calling alert, not for the active 
                    alertButtons[i].appID = parseInt(key) 
                    alertButtons[i].duration = state.ui[key].alert.duration
                }
            }   
        }
    }

    //Assign color scheme to props
    var theme = state.theme
    var colorScheme = null;
    if (theme === true) { //Dark theme
        if(app.nightColorScheme) {
            colorScheme = {}
            if(app.nightColorScheme.primaryColor) {
                colorScheme["primary"] = app.nightColorScheme.primaryColor
            }
            if(app.nightColorScheme.secondaryColor) {
                colorScheme["secondary"] = app.nightColorScheme.secondaryColor
            }
        }
    } else {
        if(app.dayColorScheme) { //Light theme
            colorScheme = {}
            if(app.dayColorScheme.primaryColor) {
                colorScheme["primary"] = app.dayColorScheme.primaryColor
            }
            if(app.dayColorScheme.secondaryColor) {
                colorScheme["secondary"] = app.dayColorScheme.secondaryColor
            }
        }
    }

    return {buttons: buttons, softButtons: softButtons, appID: activeApp, graphicPresent: graphicPresent, alertButtons: alertButtons, colorScheme: colorScheme, theme: state.theme}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onButtonPress: (appID, buttonID, buttonName) => {
            uiController.onButtonPress(appID, buttonID, buttonName)
        },
        onStealFocus:(alert, activeApp) =>{
            uiController.onStealFocus(alert, activeApp ? activeApp : null)
        },
        onKeepContext:(alert) =>{
            uiController.onKeepContext(alert)
        },
        onDefaultAction:(alert, activeApp) =>{
            uiController.onDefaultAction(alert, activeApp ? activeApp : null)
        }
    }
}

export const Buttons = connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlBar)

export const SoftButtons = connect(
    mapStateToProps,
    mapDispatchToProps
)(SoftButtonsBody)

export const AlertButtons = connect(
    mapStateToProps,
    mapDispatchToProps
)(AlertButtonsBody)

export default Buttons
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Transition from './Transition'
import DetailScreen from './DetailScreen'
import { View, Animated } from 'react-native'
//https://medium.com/react-native-training/react-native-animations-using-the-animated-api-ebe8e0669fae
// https://medium.com/react-ecosystem/how-to-handle-react-context-a7592dfdcbc
class PhotoGalleryPhoto extends Component {
 state ={
     opacity :1
 }
 static contextTypes = {
     onImageRef : PropTypes.func
 }
 setOpacity = opacity => {
     this.setState({ opacity})
 }
 render() {
     const {style, photo} = this.props
     const { opacity} = this.state
     return (
        <Animated.Image
             ref={i => this.context.onImageRef(photo, i, this.setOpacity)}
          style= {[
              style,
              {opacity}
          ]}
          source = {photo.source}
        />
     ) 
 }
}


export class PhotoGallery extends Component {
     static Photo = PhotoGalleryPhoto
    state = {
        photo : null,
        openProgress : new Animated.Value(0),
        isAnimating: false
    }

    _images = {}
    _imagesOpacitySetters = {}
    static childContextTypes = {
        onImageRef : PropTypes.func
    }
    getChildContext () {
        return { onImageRef : this._onImageRef}
    }
    _onImageRef = (photo, imageRef, setOpacity) => {
        this._images[photo.id] = imageRef
        this._imagesOpacitySetters[photo.id] = setOpacity
    }
    open = photo => {
        this._imagesOpacitySetters[photo.id](
            this.state.openProgress.interpolate({
                inputRange : [0.005, 0.01],
                outputRange : [1,0 ]
            })
        )
        this.setState( { photo ,isAnimating : true}, () => {
            Animated.timing(this.state.openProgress, {
                toValue : 1,
                duration : 300,
                useNativeDriver :true
            }).start(() => {
                this.setState({ isAnimating : false})
            })
        })
    }
    close = photoId => {
        this.setState({ photo  : null, isAnimating : true},() => {
            Animated.timing(this.state.openProgress ,{toValue : 0,
            duration :300,
            useNativeDriver : true}).start(() => {
                // set Data for function
                 this._imagesOpacitySetters[photoId](1)
                 this.setState({ isAnimating : false})
            })
        })
    }


  render() {
      const { photo, openProgress , isAnimating} = this.state
    return (
        <View style={{ flex: 1}}>
            {this.props.renderContent({ onPhotoOpen : this.open})}
            <Transition
                openProgress = {openProgress}
                photo = {photo}
                sourceImageRefs = { this._images}
                isAnimating ={isAnimating}
            />
            <DetailScreen
                photo={photo}
                onClose ={this.close}
                openProgress = {openProgress}
                isAnimating ={isAnimating}
            />
        </View>
    )
  }
};

export default PhotoGallery;

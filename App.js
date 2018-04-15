import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet,Text,View,Image,FlatList,Dimensions } from 'react-native'
import PHOTOS from './src/data'
import { processImages, buildRows, normalizeRows } from './src/utils'
import PhotoGallery from './src/PhotoGallery'
import GridItem from './src/GridItem'
const maxWidth = Dimensions.get('window').width
export class App extends Component {
  constructor(props){
    super(props)
    this.dataSource = []
  }
  componentWillMount = () => {
    /* let processedImages = processImages(PHOTOS)
    let rows = buildRows(processedImages, maxWidth)
    rows = normalizeRows(rows, maxWidth)
    this.dataSource = rows */
    const processedImages = processImages(PHOTOS);
    let rows = buildRows(processedImages, maxWidth);
    rows = normalizeRows(rows, maxWidth);

  

    // this.setState = ( {
    //  this.dataSource =  ds.cloneWithRows(rows)
    this.dataSource = rows
  }
  
  renderRow = (row, photoOpen) => (
    <View style={{ flexDirection : 'row',marginBottom : 5, justifyContent :'space-between'}}>
      {row.item.map(item => 
      <GridItem item ={item} key={item.id} onPhotoOpen ={photoOpen}/>
      )}
    </View>
  )
  
  render() {
    return (
      <PhotoGallery
      renderContent= { ({onPhotoOpen}) => (
        <FlatList
            data={this.dataSource}
        keyExtractor = { (item,index) => index.toString()}
        renderItem = {(item) => this.renderRow(item, onPhotoOpen)}
        />
      )}
      />
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})
export default App;

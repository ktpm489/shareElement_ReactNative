import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import PHOTOS from './src/data';
import { processImages, buildRows, normalizeRows } from './src/utils';
import PhotoGallery from './src/PhotoGallery';
import GridItem from './src/GridItem';

const maxWidth = Dimensions.get('window').width;

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.dataSource = []
  }
  componentWillMount() {
    const processedImages = processImages(PHOTOS);
    let rows = buildRows(processedImages, maxWidth);
    rows = normalizeRows(rows, maxWidth);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

   // this.setState = ( {
    //  this.dataSource =  ds.cloneWithRows(rows)
    this.dataSource = rows
   // });
  }

  renderRow = (row, photoOpen) =>
  (
    <View
      style={{
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between'
      }}
    >
      {row.item.map(item =>
        <GridItem item={item} key={item.id} onPhotoOpen = {photoOpen} />
      )}
    </View>
  )
  render() {
    return (
    /*   <PhotoGallery
        renderContent={({ onPhotoOpen }) =>
          <ListView
            dataSource={this.dataSource}
            renderRow={this.renderRow.bind(this, onPhotoOpen)}
          />}
      /> */
      <PhotoGallery
        renderContent={({ onPhotoOpen }) =>
          <FlatList
            extraData={onPhotoOpen}
            data={this.dataSource}
            keyExtractor=  {(item,index) => index.toString()}
            renderItem={(item) => this.renderRow(item, onPhotoOpen)}
          />}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

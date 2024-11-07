import React, {useState} from 'react';
import { ScrollView, View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

const svgString = `
<svg width="11" height="21" viewBox="0 0 11 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.74996 19.34C10.1139 19.7544 10.0737 20.3852 9.65996 20.75C9.24556 21.114 8.61471 21.0737 8.24996 20.66L0.249955 11.66C-0.0816908 11.2825 -0.0816908 10.7175 0.249955 10.34L8.24996 1.34C8.48059 1.05366 8.84975 0.916976 9.21124 0.984074C9.57274 1.05117 9.86826 1.31123 9.98078 1.66126C10.0933 2.01129 10.0047 2.39484 9.74996 2.66L2.33996 11L9.74996 19.34Z" fill="#111111"/>
</svg>`;

const svgString1 = `
<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24.9998 23.5867L18.7378 17.3247C20.3644 15.3353 21.1642 12.7968 20.9716 10.2343C20.7791 7.67173 19.609 5.28123 17.7034 3.55722C15.7977 1.83321 13.3024 0.90759 10.7334 0.971822C8.16447 1.03605 5.71848 2.08522 3.9014 3.90231C2.08431 5.7194 1.03514 8.16539 0.970906 10.7343C0.906674 13.3033 1.83229 15.7987 3.5563 17.7043C5.28031 19.6099 7.67081 20.78 10.2333 20.9725C12.7959 21.1651 15.3344 20.3653 17.3238 18.7387L23.5858 25.0007L24.9998 23.5867ZM10.9998 19.0007C9.41753 19.0007 7.87081 18.5315 6.55522 17.6525C5.23963 16.7734 4.21425 15.524 3.60875 14.0622C3.00324 12.6004 2.84482 10.9918 3.1535 9.43997C3.46218 7.88813 4.22411 6.46266 5.34293 5.34384C6.46175 4.22502 7.88721 3.4631 9.43906 3.15441C10.9909 2.84573 12.5994 3.00416 14.0612 3.60966C15.5231 4.21516 16.7725 5.24054 17.6515 6.55614C18.5306 7.87173 18.9998 9.41845 18.9998 11.0007C18.9974 13.1217 18.1538 15.1551 16.654 16.6549C15.1542 18.1547 13.1208 18.9983 10.9998 19.0007Z" fill="black"/>
</svg>`;

const svgString2 = `
<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 7.00001H18.6667C18.6667 4.42168 16.5783 2.33334 14 2.33334C11.4217 2.33334 9.33332 4.42168 9.33332 7.00001H6.99999C5.71666 7.00001 4.66666 8.05001 4.66666 9.33334V23.3333C4.66666 24.6167 5.71666 25.6667 6.99999 25.6667H21C22.2833 25.6667 23.3333 24.6167 23.3333 23.3333V9.33334C23.3333 8.05001 22.2833 7.00001 21 7.00001ZM14 4.66668C15.2833 4.66668 16.3333 5.71668 16.3333 7.00001H11.6667C11.6667 5.71668 12.7167 4.66668 14 4.66668ZM21 23.3333H6.99999V9.33334H9.33332V11.6667C9.33332 12.3083 9.85832 12.8333 10.5 12.8333C11.1417 12.8333 11.6667 12.3083 11.6667 11.6667V9.33334H16.3333V11.6667C16.3333 12.3083 16.8583 12.8333 17.5 12.8333C18.1417 12.8333 18.6667 12.3083 18.6667 11.6667V9.33334H21V23.3333Z" fill="black"/>
</svg>`;

const Store = ({ onBack }) => {
  const [selectedFilter, setSelectedFilter] = useState('앱 내 용품');
  const [numColumns, setNumColumns] = useState(2);
  const [products, setProducts] = useState([{
    id: 1,
    image: 'https://example.com/image1.jpg',
    name: 'Sample Product 1',
    description: 'This is a sample product description.',
    price: '10,000원',
  },
  {
    id: 2,
    image: 'https://example.com/image2.jpg',
    name: 'Sample Product 2',
    description: 'Another sample description.',
    price: '20,000원',
  },{
    id: 3,
    image: 'https://example.com/image1.jpg',
    name: 'Sample Product 3',
    description: 'This is a sample product description.',
    price: '30,000원',
  },{
    id: 4,
    image: 'https://example.com/image1.jpg',
    name: 'Sample Product 4',
    description: 'This is a sample product description.',
    price: '40,000원',
  },{
    id: 5,
    image: 'https://example.com/image1.jpg',
    name: 'Sample Product 5',
    description: 'This is a sample product description.',
    price: '50,000원',
  },{
    id: 6,
    image: 'https://example.com/image1.jpg',
    name: 'Sample Product 6',
    description: 'This is a sample product description.',
    price: '60,000원',
  },]);
  const [productImage, setProductImage] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const addProduct = () => {
    const newProduct = {
      id: products.length + 1,
      image: productImage,
      name: productName,
      description: productDescription,
      price: productPrice,
    };
    setProducts([...products, newProduct]); // 부모 컴포넌트에 새로운 상품 전달
    setProductImage('');
    setProductName('');
    setProductDescription('');
    setProductPrice('');
  };

  const handleFilterSelect = (filter) => setSelectedFilter(filter);

  const renderItem = ({ item }) => (
    <View style={{marginRight: 10, marginBottom: 20}}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.itemText}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription} numberOfLines={2}>{formatDescription(item.description)}</Text>
        <Text style={styles.itemPrice}>{item.price}</Text>
      </View>
    </View>
  );

  const formatDescription = (description) => {
    const maxLength = 20;
    let formattedText = '';
    
    for (let i = 0; i < description.length; i += maxLength) {
      formattedText += description.slice(i, i + maxLength) + '\n';
    }
    
    return formattedText.trim();  // 마지막 줄바꿈을 제거
  };

  const handleGoBack = () => {
    if (onBack) {
      onBack(); // onBack prop이 있으면 호출
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.headerContainer}>
        <View style={styles.header1}>
          <TouchableOpacity onPress={handleGoBack}>
            <SvgXml xml={svgString} width="24" height="24" style={styles.icon}/>
          </TouchableOpacity>
        </View>
        <View style={styles.header2}>
          <TouchableOpacity>
            <SvgXml xml={svgString1} width="24" height="24" style={styles.icon}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <SvgXml xml={svgString2} width="28" height="28" style={styles.icon}/>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            selectedFilter === '앱 내 용품' ? styles.activeFilter : null
          ]}
          onPress={() => handleFilterSelect('앱 내 용품')}
        >
          <Text style={selectedFilter === '앱 내 용품' ? styles.activeFilterText : styles.filterText}>
            앱 내 용품
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            selectedFilter === '중고 거래' ? styles.activeFilter : null
          ]}
          onPress={() => handleFilterSelect('중고 거래')}
        >
          <Text style={selectedFilter === '중고 거래' ? styles.activeFilterText : styles.filterText}>
            중고 거래
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.title}>
        <Text style={styles.titleText}>상품 <Text style={styles.productCount}>{products.length}</Text></Text>
        <Text style={styles.titleText}>최신 순</Text>
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.menuBar}>
          <View style={styles.menuItem}><Text style={styles.menu}>전체</Text></View>
          <View style={styles.menuItem}><Text style={styles.menu}>사료</Text></View>
          <View style={styles.menuItem}><Text style={styles.menu}>사료</Text></View>
          <View style={styles.menuItem}><Text style={styles.menu}>간식</Text></View>
          <View style={styles.menuItem}><Text style={styles.menu}>간식</Text></View>
          <View style={styles.menuItem}><Text style={styles.menu}>배변 패드</Text></View>
          <View style={styles.menuItem}><Text style={styles.menu}>장난감</Text></View>
          <View style={styles.menuItem}><Text style={styles.menu}>티셔츠/후드</Text></View>
          <View style={styles.menuItem}><Text style={styles.menu}>패딩</Text></View>
          <View style={styles.menuItem}><Text style={styles.menu}>목줄</Text></View>
        </View>
      </ScrollView>

        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.productList}
          numColumns={numColumns} // numColumns 값은 동적으로 설정됨
          key={numColumns}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    position: 'absolute',
    top: 55,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  header1: {
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 8,
  },
  filterContainer: {
    position: 'absolute',
    top: 110,
    width: '50%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingEnd: 3,
    paddingStart: 3,
    padding: 12,
    borderRadius: 50,
    backgroundColor: '#F1F1F5',
    overflow: 'hidden',
  },
  filterText: {
    fontSize: 16,
    fontWeight: '500',
    paddingEnd: 12,
    paddingStart: 12,
    color: '#A9A9A9', // 비활성화 텍스트 색상
  },
  activeFilter: {
    backgroundColor: '#FFFFFF', // 활성화된 버튼 배경색
    paddingHorizontal: 20,
    height: '200%',
    top: -10,
    borderRadius: 50,
  },
  activeFilterText: {
    fontSize: 16,
    fontWeight: '900',
    top: 10,
    color: '#111111', // 활성화된 텍스트 색상
  },
  title: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 170,
  },
  titleText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
  productCount: {
    color: '#0075FF',
  },
  scrollView: {
    paddingRight: 20,
    width: '100%',
    marginTop: 100,
  },
  menuBar: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  menuItem: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  productList: {
    width: '100%',
  },
  image: {
    height: 180,
    width: 180,
    borderRadius: 8,
    backgroundColor: '#999999',
  },
  itemText: {
    marginLeft: 8,
  },
  itemName: {
    marginTop: 5,
  },
  itemDescription: {
    color: '#888888',
  },
  itemPrice: {
    marginTop: 10,
    fontWeight: '700',
  },
});

export default Store;
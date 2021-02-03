import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ScrollView,
  Image,
  TouchableHighlight,
  Modal,
  ImageBackground,
  Linking,
} from "react-native";
export default function App() {
  const apiKey = `?api_key=fac34116c639f3e75cd5205251be421c`;
  const trailer = `&append_to_response=videos,images`;
  const ok = `https://api.themoviedb.org/3/movie/`;
  const api = `https://api.themoviedb.org/3/search/movie${apiKey}`;
  const [movies, setMovies] = useState({
    search: "",
    movie: [],
    selected: {},
  });
  const [trailerKey, setTrailerKey] = useState([]);

  const searchMovie = (text) => {
    setMovies((prevstate) => {
      return { ...prevstate, search: text };
    });
  };

  const movieData = () => {
    axios(api + `&query=` + movies.search).then(({ data }) => {
      let results = data.results;
      console.log(results);
      setMovies((prevState) => {
        return { ...prevState, movie: results };
      });
    });
  };

  const openPopup = (id) => {
    axios(ok + id + apiKey + trailer).then(({ data }) => {
      let resultId = data;
      let video = data.videos.results;
      console.log(video);
      setTrailerKey(video);
      setMovies((prevState) => {
        return { ...prevState, selected: resultId };
      });
    });
  };
  console.log(trailerKey);

  const closePopup = () => {
    setMovies((prevState) => {
      return { ...prevState, selected: {} };
    });
  };

  /* useEffect(
    (id) => {
      axios(api + id + apiKey + trailer).then(({ data }) => {
        setTrailerKey(data.results);
      });
    },
    [api + id + apiKey + trailer]
  ); */
  console.log(trailerKey);
  let trailerMovie = "";

  for (let i = 0; i < trailerKey.length; i++) {
    let name = trailerKey[i].name.toLowerCase().split(" ");
    for (let a = 0; a < name.length; a++) {
      if (name[a] === "official" && name[a] === "trailer") {
        trailerMovie = trailerKey[i].key;
        name = trailerKey[i].name;
      }
      if (name[a] === "trailer") {
        trailerMovie = trailerKey[i].key;
        name = trailerKey[i].name;
      }
    }
  }

  let url = `https://www.youtube.com/embed/${trailerMovie}`;
  console.log(trailerMovie);
  console.log(url);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie DB</Text>
      <TextInput
        style={styles.searchbar}
        placeholder="search"
        onChangeText={searchMovie}
        onSubmitEditing={movieData}
      />
      <StatusBar style="auto" />
      <ScrollView style={styles.results}>
        {movies.movie.map((movie) => (
          <TouchableHighlight
            key={movie.id}
            onPress={() => openPopup(movie.id)}
          >
            <View style={styles.movie}>
              <Image
                style={styles.Image}
                source={{
                  uri: `https://image.tmdb.org/t/p/w185/` + movie.poster_path,
                }}
              />
              <Text style={styles.text}>{movie.original_title}</Text>
            </View>
          </TouchableHighlight>
        ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={typeof movies.selected.original_title != "undefined"}
      >
        <View style={styles.Popup}>
          <Image
            source={{
              uri:
                `https://image.tmdb.org/t/p/w185/` +
                movies.selected.backdrop_path,
            }}
            style={styles.Imageid}
          />
          <Text style={styles.test}>{movies.selected.original_title}</Text>
          <View
            style={{
              paddingTop: 20,
              paddingBottom: 20,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Text>Date:{movies.selected.release_date}</Text>
            <Text>lg:{movies.selected.original_language}</Text>
            <Text>imdb:{movies.selected.vote_average}</Text>
          </View>
          <Text style={styles.overview}>{movies.selected.overview}</Text>
          <Text
            style={{
              fontStyle: "italic",
              fontSize: 20,
              textAlign: "center",
              paddingTop: 15,
              paddingBottom: 15,
            }}
          >
            {movies.selected.tagline}
          </Text>
          <Text
            style={{ paddingLeft: 15, color: "blue" }}
            onPress={() => Linking.openURL(movies.selected.homepage)}
          >
            {movies.selected.homepage}
          </Text>
          <View>
            <WebView
              style={{ width: "100%", height: 250 }}
              source={{ uri: url }}
              frameBorder="0"
              type="text/html"
            />
          </View>
          <Button title="close" onPress={() => closePopup()} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000034",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 70,
  },
  title: {
    fontSize: 35,
    color: "#fff",
  },
  searchbar: {
    backgroundColor: "white",
    fontSize: 20,
    fontWeight: "300",
    width: "80%",
    padding: 20,
    marginBottom: 40,
    borderRadius: 10,
  },
  results: {
    flex: 1,
  },
  movie: {
    flex: 1,
    width: "100%",
    marginBottom: 20,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    padding: 20,
    backgroundColor: "#445565",
  },
  Popup: {
    paddingTop: 50,
  },
  Image: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },
  Imageid: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    aspectRatio: 1.5,
    justifyContent: "center",
    alignSelf: "center",
  },
  test: {
    fontSize: 20,
    textAlign: "center",
  },
  overview: {
    padding: 10,
    fontSize: 15,
  },
});

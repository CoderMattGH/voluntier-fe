import { View, ScrollView, Text, Image, TouchableOpacity } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { singleListingStyles as styles } from "../styles/singleListingStyles";
import { postFavourite } from "../api";
import { UserContext } from "../contexts/user-context";
import { useContext, useEffect } from "react";
import { useState } from "react";
import * as api from "../api";

export default function SingleListing({ route }) {
  const { listing } = route.params;
  const date = new Date(listing.list_date);
  const time = new Date(`1970-01-01T${listing.list_time}`);
  const { user } = useContext(UserContext);
  const [isFavourite, setIsFavourite] = useState(false);

  const [listImg, setListImg] = useState(null);

  useEffect(() => {
    const { list_img_id } = listing;

    if (list_img_id) {
      api
        .getB64Image(list_img_id)
        .then(({ img_b64_data }) => {
          setListImg(img_b64_data);
        })
        .catch((err) => {
          console.log("ERROR: Cannot get image data!");
        });
    }
  }, [listing]);

  const formattedDate = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  function handleFavouritePress() {
    setIsFavourite(!isFavourite);
    postFavourite(listing.list_id, user.vol_id, user.token).then((data) => {});
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{listing.list_title}</Text>
        <Text style={styles.orgName}>{listing.org_name}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        ></View>
        <View style={styles.favourite}>
          <TouchableOpacity onPress={handleFavouritePress}>
            <FontAwesomeIcon
              icon={faHeart}
              size={35}
              style={{ color: isFavourite ? "#FFC1C1" : "#ff0505" }}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>Duration: {listing.list_duration} hours</Text>
        <Text style={styles.text}>
          {formattedDate} {formattedTime}
        </Text>

        <View>
          {listImg ? (
            <Image source={{ uri: listImg }} style={styles.image} />
          ) : (
            <Image
              source={require("../assets/listing-image.jpg")}
              style={styles.image}
            />
          )}
        </View>
        <Text style={styles.titleText}>What you'll be doing:</Text>
        <Text style={styles.text}>{listing.list_description}</Text>
      </View>
    </ScrollView>
  );
}

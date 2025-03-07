import { UserContext } from "../contexts/user-context";
import { View, FlatList, Pressable } from "react-native";
import { listingStyles as styles } from "../styles/listingStyles";
import { useContext, useEffect, useState } from "react";
import { getOrgListings } from "../api";
import ListingCard from "./ListingCard";
import { useNavigation } from "@react-navigation/native";

export default function OrgListings({ orgListings, setOrgListings }) {
  const { user } = useContext(UserContext);
  const [err, setErr] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getOrgListings(user.org_id, user.token)
      .then((listings) => {
        setOrgListings(listings);
      })
      .catch((error) => {
        setErr(error);
      });
  }, []);

  const handlePress = (listing) => {
    navigation.navigate("SingleListing", { listing });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orgListings}
        renderItem={(item) => {
          return (
            <Pressable
              onPress={() => handlePress(item.item)}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgba(0, 0, 0, 0.1)" : "white",
                },
              ]}
            >
              <ListingCard listing={item.item}></ListingCard>
            </Pressable>
          );
        }}
        keyExtractor={(item, index) => {
          return index.toString();
        }}
      />
    </View>
  );
}

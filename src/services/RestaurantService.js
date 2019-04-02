const endpoint = 'https://restaurant-reviews-node.herokuapp.com/restaurant';

export const getRestaurants = async () => {
  try {
    const res = await fetch(endpoint);
    return await res.json();
  }
  catch (error) {
    return error;
  }
}

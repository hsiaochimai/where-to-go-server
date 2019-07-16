INSERT INTO
  users (full_name, email, password)
VALUES
  (
    'Christina Fuller',
    'demo@demo.com',
    'demo'
  ),
  (
    'Gina Monster',
    'bye@history.com',
    'byeeeee1'
  );
INSERT INTO
  trips (name, numOfDays, user_id, completed)
VALUES
  ('Portland', 3, 1, false),
  ('Los Angeles', 4, 1, false),
  ('New Orlenas', 5, 2, false);
INSERT INTO
 places (
    name,
    trip_id,
    street_address,
    city,
    transportation,
    notes,
    visited
  )
VALUES
  (
    'Powells books',
    1,
    '1005 W Burnside St',
    'Portland',
    'Max blue line',
    'Cool independent book store that Billy told me about',
    false
  ),
  (
    'Washington Park',
    1,
    '4033 Southwest Canyon Road',
    'Portland',
    'car',
    'Cool park that Sonya told me about',
    false
  ),
  (
    'Griffith Park',
    2,
    '4730 Crystal Springs Dr',
    'Los Angeles',
    'car',
    'Cool park in LA',
    false
  ),
  (
    'Santa Monica Pier',
    2,
    '200 Santa Monica Pier',
    'Santa Monica',
    'car',
    'Pier with fun stuff and was in a lot of movies',
    false
  ),
  (
    'French Quarter',
    3,
    'St. Charles Avenue',
    'New Orleans',
    'car',
    'Jenn said that it has a really cool vibe',
    false
  ),
  (
    'St. Louis Cathedral',
    3,
    '615 Pere Antoine Aly,',
    'New Orleans',
    'car',
    'Beautiful Cathedral ',
    false
  );
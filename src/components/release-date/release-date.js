import React from 'react';
import { format, parseISO } from 'date-fns';

function ReleaseDate({ filmRelease }) {
  const date = parseISO(filmRelease);
  const formattedDate = format(date, 'MMMM d, yyyy');
  return <p>{formattedDate}</p>;
}

export default ReleaseDate;

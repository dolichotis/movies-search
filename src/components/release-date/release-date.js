import React from 'react';
import { format, isValid, parseISO } from 'date-fns';

function ReleaseDate({ filmRelease }) {
  const formattedDate =
    filmRelease && isValid(parseISO(filmRelease)) ? format(parseISO(filmRelease), 'MMMM dd, yyyy') : 'no release date';
  return <p>{formattedDate}</p>;
}

export default ReleaseDate;

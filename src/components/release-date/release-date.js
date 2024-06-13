import React from 'react';
import { format, isValid, parseISO } from 'date-fns';

import './release-date.css';

function ReleaseDate({ filmRelease }) {
  const formattedDate =
    filmRelease && isValid(parseISO(filmRelease)) ? format(parseISO(filmRelease), 'MMMM dd, yyyy') : 'no release date';
  return <p className="releaseDate">{formattedDate}</p>;
}

export default ReleaseDate;

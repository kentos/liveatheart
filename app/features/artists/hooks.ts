import _ from 'lodash';
import { useState, useEffect } from 'react';

const delay = async () => new Promise((res) => setTimeout(res, 250));

let loadedData: Artist[];

async function loadData() {
  if (loadedData) {
    return loadedData;
  }
  const raw = require('./mockdata.json');
  await delay();
  loadedData = raw;
  return raw;
}

function useArtistsData(ids?: string | string[]): Artist[] {
  const [data, setData] = useState<Artist[]>([]);

  useEffect(() => {
    async function load() {
      const loaded = await loadData();
      setData(() => loaded);
    }
    load();
  }, []);

  if (ids) {
    if (_.isArray(ids)) {
      return data.filter((a) => ids.includes(a.id));
    }
    return data.filter((a) => a.id === ids);
  }
  return data;
}

export { useArtistsData };

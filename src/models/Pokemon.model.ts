// src/models/Pokemon.model.ts
interface PokemonApiResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}

interface PokemonTypeData {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

export class PokemonModel {
  private static instance: PokemonModel;
  private pokemonCache: Pokemon[] | null = null;
  private fetchPromise: Promise<Pokemon[]> | null = null;
  private readonly CACHE_KEY = 'pokemon-cache';
  private readonly CACHE_TIMESTAMP_KEY = 'pokemon-cache-timestamp';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  public static getInstance(): PokemonModel {
    if (!PokemonModel.instance) {
      PokemonModel.instance = new PokemonModel();
    }
    return PokemonModel.instance;
  }

  private constructor() {
    // Try to load cache from localStorage on instantiation
    this.loadFromLocalStorage();
  }

  private isServer(): boolean {
    return typeof window === 'undefined';
  }

  private loadFromLocalStorage(): void {
    if (this.isServer()) return;

    try {
      const timestamp = window.localStorage.getItem(this.CACHE_TIMESTAMP_KEY);
      const cacheAge = timestamp ? Date.now() - parseInt(timestamp) : Infinity;

      if (cacheAge < this.CACHE_DURATION) {
        const cached = window.localStorage.getItem(this.CACHE_KEY);
        if (cached) {
          this.pokemonCache = JSON.parse(cached);
          console.log('Loaded Pokemon from localStorage cache');
        }
      } else if (timestamp) {
        // Clear expired cache
        window.localStorage.removeItem(this.CACHE_KEY);
        window.localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
        console.log('Cleared expired Pokemon cache');
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  private saveToLocalStorage(pokemon: Pokemon[]): void {
    if (this.isServer()) return;

    try {
      window.localStorage.setItem(this.CACHE_KEY, JSON.stringify(pokemon));
      window.localStorage.setItem(this.CACHE_TIMESTAMP_KEY, Date.now().toString());
      console.log('Saved Pokemon to localStorage cache');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  private async fetchPokemonBatch(urls: string[]): Promise<Pokemon[]> {
    const pokemonDetails = await Promise.allSettled(
      urls.map(async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          return {
            id: data.id,
            name: data.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
            types: data.types.map((t: PokemonTypeData) => t.type.name)
          };
        } catch (error) {
          console.error(`Failed to fetch Pokemon from ${url}:`, error);
          return null;
        }
      })
    );

    return pokemonDetails
      .filter((result): result is PromiseFulfilledResult<Pokemon | null> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value)
      .filter((pokemon): pokemon is Pokemon => pokemon !== null);
  }

  async getAllPokemon(): Promise<Pokemon[]> {
    // Return cached results if available
    if (this.pokemonCache) {
      console.log('Returning in-memory cached Pokemon list');
      return this.pokemonCache;
    }

    // If there's already a fetch in progress, return that promise
    if (this.fetchPromise) {
      console.log('Fetch already in progress, returning existing promise');
      return this.fetchPromise;
    }

    console.log('Starting new Pokemon fetch...');
    const startTime = Date.now();

    this.fetchPromise = (async () => {
      try {
        // Get total count first
        const initialResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
        if (!initialResponse.ok) throw new Error(`HTTP error! status: ${initialResponse.status}`);
        const initialData = await initialResponse.json() as PokemonApiResponse;
        const totalCount = initialData.count;
        console.log(`Total Pokemon to fetch: ${totalCount}`);

        // Get all Pokemon URLs in one request
        const fullListResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${totalCount}`);
        if (!fullListResponse.ok) throw new Error(`HTTP error! status: ${fullListResponse.status}`);
        const fullListData = await fullListResponse.json() as PokemonApiResponse;

        // Process in larger parallel batches
        const batchSize = 30;
        const allPokemon: Pokemon[] = [];
        const totalBatches = Math.ceil(fullListData.results.length / batchSize);
        
        for (let i = 0; i < fullListData.results.length; i += batchSize) {
          const batch = fullListData.results.slice(i, i + batchSize);
          const currentBatch = Math.floor(i / batchSize) + 1;
          console.log(`Fetching batch ${currentBatch}/${totalBatches}`);
          
          const batchResults = await this.fetchPokemonBatch(batch.map(p => p.url));
          allPokemon.push(...batchResults);

          const progress = ((allPokemon.length / totalCount) * 100).toFixed(1);
          console.log(`Progress: ${allPokemon.length}/${totalCount} (${progress}%)`);
        }

        const sorted = allPokemon.sort((a, b) => a.id - b.id);
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`Fetch completed in ${totalTime}s!`);

        // Cache the results both in memory and localStorage
        this.pokemonCache = sorted;
        this.saveToLocalStorage(sorted);
        return sorted;
      } catch (error) {
        console.error('Failed to fetch Pokemon:', error);
        throw error;
      } finally {
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  clearCache(): void {
    this.pokemonCache = null;
    if (!this.isServer()) {
      window.localStorage.removeItem(this.CACHE_KEY);
      window.localStorage.removeItem(this.CACHE_TIMESTAMP_KEY);
      console.log('Pokemon cache cleared (both memory and localStorage)');
    }
  }
}
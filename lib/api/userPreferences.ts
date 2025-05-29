import { getSupabaseClient } from "./supabase";

// This class handles insertion and deletion of movies in the user's watchlist and history tables.

export class UserPreferences {
    private token: Promise<string | null>;
    
    // Constructor accepts a token which is used to authenticate requests to Supabase.
    constructor(token: Promise<string | null>) {
        this.token = token;
    }
    
    private async getSupabase() {
        const resolvedToken = await this.token;
        if (!resolvedToken) {
            throw new Error('Authentication token is not available');
        }
        return getSupabaseClient(Promise.resolve(resolvedToken));
    }

    async getWatchlist(): Promise<number[]> {
        try {
            const supabase = await this.getSupabase();
            const { data, error } = await supabase
                .from('watchlist')
                .select('user_id, movie_id');

            if (error) {
                throw new Error(`Failed to fetch watchlist: ${error.message}`);
            }

            return data?.map(item => item.movie_id) || [];
        } catch (err) {
            console.error('Watchlist fetch error:', err);
            return [];
        }
    }

    async isInWatchlist(movieId: number, userId: string):Promise<boolean> {
        try{
           const supabase = await this.getSupabase();
            const { data,error } = await supabase
                .from('watchlist')
                .select()
                .match({ movie_id: movieId, user_id: userId });

            if (error) {
                throw new Error(`Failed to get movie from watchlist: ${error.message}`);
            }

            return Array.isArray(data) && data.length > 0;
        }catch (error) {
          console.error('Failed to check watchlist',error)
          return false;
        }
    }

    async addToWatchlist(movieId: number, userId: string): Promise<void> {
        try {
            const supabase = await this.getSupabase();
            const { error } = await supabase
                .from('watchlist')
                .insert([{ movie_id: movieId, user_id: userId }]);

            if (error) {
                throw new Error(`Failed to add movie to watchlist: ${error.message}`);
            }
        } catch (err) {
            console.error('Add to watchlist error:', err);
            throw err;
        }
    }

    async removeFromWatchlist(movieId: number, userId: string): Promise<void> {
        try {
            const supabase = await this.getSupabase();
            const { error } = await supabase
                .from('watchlist')
                .delete()
                .match({ movie_id: movieId, user_id: userId });

            if (error) {
                throw new Error(`Failed to remove movie from watchlist: ${error.message}`);
            }
        } catch (err) {
            console.error('Remove from watchlist error:', err);
            throw err;
        }
    }

    async getHistory(): Promise<number[]> {
        try {
            const supabase = await this.getSupabase();
            const { data, error } = await supabase
                .from('history')
                .select('user_id, movie_id');

            if (error) {
                throw new Error(`Failed to fetch history: ${error.message}`);
            }

            return data?.map(item => item.movie_id) || [];
        } catch (err) {
            console.error('History fetch error:', err);
            return [];
        }
    }


    async isInHistory(movieId: number, userId: string): Promise<boolean> {
        try {
            const supabase = await this.getSupabase();
            const { data, error } = await supabase
                .from('history')
                .select()
                .match({ movie_id: movieId, user_id: userId });

            if (error) {
                throw new Error(`Failed to get movie from history: ${error.message}`);
            }

            return Array.isArray(data) && data.length > 0;
        } catch (error) {
            console.error('Failed to check history', error);
            return false;
        }
    }

    async addToHistory(movieId: number, userId: string): Promise<void> {
        try {
            const supabase = await this.getSupabase();
            const { error } = await supabase
                .from('history')
                .insert([{ movie_id: movieId, user_id: userId }]);

            if (error) {
                throw new Error(`Failed to add movie to history: ${error.message}`);
            }
        } catch (err) {
            console.error('Add to history error:', err);
            throw err;
        }
    }

    async removeFromHistory(movieId: number, userId: string): Promise<void> {
        try {
            const supabase = await this.getSupabase();
            const { error } = await supabase
                .from('history')
                .delete()
                .match({ movie_id: movieId, user_id: userId });

            if (error) {
                throw new Error(`Failed to remove movie from history: ${error.message}`);
            }
        } catch (err) {
            console.error('Remove from history error:', err);
            throw err;
        }
    }
}
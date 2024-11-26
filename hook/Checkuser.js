import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

export default function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const supabase = useSupabaseClient();
        const router = useRouter();

        useEffect(() => {
            const checkSession = async () => {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.push(`/login?redirectedFrom=${router.pathname}`);
                }
            };

            checkSession();
        }, [router, supabase]);

        return <Component {...props} />;
    };
}

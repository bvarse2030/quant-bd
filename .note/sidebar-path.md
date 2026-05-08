## Credential

=> Account
-> /dashboard/credential/account

=> Session
-> /dashboard/credential/session

=> Verification
-> /dashboard/credential/verification

## Admin

=> Access
-> /dashboard/admin/access

=> Footer Editor
-> /dashboard/admin/footer-editor

=> Install Popup
-> /dashboard/admin/install-popup

=> Menu Editor
-> /dashboard/admin/menu-editor

=> Role
-> /dashboard/admin/role

=> Sidebar
-> /dashboard/admin/sidebar

=> Users
-> /dashboard/admin/users

=> Page Builder
-> /dashboard/admin/page-builder

## Raw Path

=> Media
-> /dashboard/media

=> Profile
-> /dashboard/profile

## Disabled access

    - inside [.env.local] change true to false
        IS_ACTIVE_AUTHORIZATION=false
        NEXT_PUBLIC_IS_ACTIVE_AUTHORIZATION=false
        AuthorizationEnable=false
        NEXT_PUBLIC_AuthorizationEnable=false

    - inside [dashboard/hasAccess.tsx]
        comment those line
        ~~~  if (!hasPermission) {
        const roleStatus = rolesError as { status: number };
        const accessManagementStatus = accessManagementError as { status: number };
        if (roleStatus?.status === 429 || accessManagementStatus?.status === 429) {
        return <TooManyRequests />;
        }
        return (
        <main>
        <UnauthorizedView />
        </main>
        );
        }
        ```

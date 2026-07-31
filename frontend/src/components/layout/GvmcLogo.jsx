/**
 * src/components/layout/GvmcLogo.jsx
 * Reusable GVMC logo component – uses the real official seal image.
 * Sizes: sm=32px, md=44px, lg=56px, xl=72px
 */

export default function GvmcLogo({ size = 'md', className = '', rounded = 'xl' }) {
    const sizes = { sm: 32, md: 44, lg: 56, xl: 72 };
    const px = sizes[size] || sizes.md;

    return (
        <img
            src="/assets/gvmc-logo.jpg"
            alt="GVMC – Greater Visakhapatnam Municipal Corporation Official Seal"
            width={px}
            height={px}
            className={`rounded-${rounded} object-contain bg-white shadow-sm ${className}`}
            style={{ width: px, height: px }}
        />
    );
}

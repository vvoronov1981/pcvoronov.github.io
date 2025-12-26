/**
 * Particles Module
 * Creates animated particle background using Canvas API
 */

class ParticlesAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.warn('Canvas element not found');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.config = CONFIG.particlesConfig;
        this.animationId = null;
        this.mouse = { x: null, y: null, radius: 150 };
        
        this.init();
    }

    /**
     * Initialize particles system
     */
    init() {
        this.resizeCanvas();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    /**
     * Resize canvas to fill container
     */
    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    /**
     * Create particle objects
     */
    createParticles() {
        this.particles = [];
        const numberOfParticles = Math.min(
            this.config.count,
            Math.floor((this.canvas.width * this.canvas.height) / 10000)
        );

        for (let i = 0; i < numberOfParticles; i++) {
            this.particles.push(new Particle(
                this.canvas.width,
                this.canvas.height,
                this.config
            ));
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    /**
     * Animation loop
     */
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.canvas.width, this.canvas.height);
            particle.draw(this.ctx);
        });

        // Connect particles with lines
        this.connectParticles();

        // Interact with mouse
        this.handleMouseInteraction();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    /**
     * Connect nearby particles with lines
     */
    connectParticles() {
        const maxDistance = 120;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.3;
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    /**
     * Handle mouse interaction with particles
     */
    handleMouseInteraction() {
        if (this.mouse.x === null || this.mouse.y === null) return;

        this.particles.forEach(particle => {
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                particle.vx -= Math.cos(angle) * force * 0.5;
                particle.vy -= Math.sin(angle) * force * 0.5;
            }
        });
    }

    /**
     * Stop animation
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Resume animation
     */
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
}

/**
 * Particle class
 */
class Particle {
    constructor(canvasWidth, canvasHeight, config) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.radius = Math.random() * 2 + 1;
        this.color = config.color;
    }

    /**
     * Update particle position
     */
    update(canvasWidth, canvasHeight) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvasWidth) {
            this.vx = -this.vx;
            this.x = Math.max(0, Math.min(canvasWidth, this.x));
        }

        if (this.y < 0 || this.y > canvasHeight) {
            this.vy = -this.vy;
            this.y = Math.max(0, Math.min(canvasHeight, this.y));
        }

        // Apply friction
        this.vx *= 0.99;
        this.vy *= 0.99;
    }

    /**
     * Draw particle
     */
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticlesAnimation;
}
